import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const LOCAL_STORAGE_KEY = "addedUsersList";

const AddUsersForm = () => {
  const [numUsers, setNumUsers] = useState(1);
  const [users, setUsers] = useState([
    { email: "", first_name: "", last_name: "", password: "" },
  ]);
  const [passwordErrors, setPasswordErrors] = useState({}); // Track password validation errors
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [addedUsers, setAddedUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [recentlyAddedUsers, setRecentlyAddedUsers] = useState([]);

  // Password validation function
  const validatePassword = (password) => {
    if (!password) return null; // Don't validate empty passwords
    
    const hasAlphabets = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!hasAlphabets || !hasNumbers || !hasSpecialChars) {
      return "Password must contain alphabets, special characters, and numbers";
    }
    
    return null; // Password is valid
  };

  // Load added users from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setAddedUsers(JSON.parse(stored));
      } catch {
        setAddedUsers([]);
      }
    }
  }, []);

  // Save added users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(addedUsers));
  }, [addedUsers]);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [showExcelPreview, setShowExcelPreview] = useState(false);

  const handleNumUsersChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumUsers(value);
    
    // Reset Excel data when number of users changes
    if (showExcelPreview) {
      setExcelFile(null);
      setExcelData([]);
      setShowExcelPreview(false);
      setError(""); // Clear any existing errors
    }
    
    setUsers((prev) => {
      const newUsers = [...prev];
      if (value > prev.length) {
        for (let i = prev.length; i < value; i++) {
          newUsers.push({ email: "", first_name: "", last_name: "", password: "" });
        }
      } else {
        newUsers.length = value;
      }
      return newUsers;
    });
    
    // Update password errors to match new user count
    setPasswordErrors((prev) => {
      const newErrors = {};
      for (let i = 0; i < value; i++) {
        if (prev[i] !== undefined) {
          newErrors[i] = prev[i];
        }
      }
      return newErrors;
    });
  };

  const handleUserChange = (idx, field, value) => {
    setUsers((prev) => {
      const arr = [...prev];
      arr[idx][field] = value;
      return arr;
    });
    
    // Validate password when password field changes
    if (field === "password") {
      const validationError = validatePassword(value);
      setPasswordErrors((prev) => ({
        ...prev,
        [idx]: validationError
      }));
    }
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [header, ...rows] = json;
      const headerMap = header.map(h => h && h.toString().toLowerCase().trim());
      
      // More flexible column name matching
      const emailIdx = headerMap.findIndex(h => h.includes('email'));
      const passwordIdx = headerMap.findIndex(h => h.includes('password'));
      const firstNameIdx = headerMap.findIndex(h => 
        h.includes('first') && (h.includes('name') || h.includes('_name'))
      );
      const lastNameIdx = headerMap.findIndex(h => 
        h.includes('last') && (h.includes('name') || h.includes('_name'))
      );
      
      if (emailIdx === -1 || passwordIdx === -1 || firstNameIdx === -1 || lastNameIdx === -1) {
        const missingColumns = [];
        if (emailIdx === -1) missingColumns.push('email');
        if (passwordIdx === -1) missingColumns.push('password');
        if (firstNameIdx === -1) missingColumns.push('first_name/firstName');
        if (lastNameIdx === -1) missingColumns.push('last_name/lastName');
        
        setError(`Missing required columns: ${missingColumns.join(', ')}. Available columns: ${headerMap.join(', ')}`);
        return;
      }
      
      const parsedUsers = rows
        .filter(row => row[emailIdx] && row[passwordIdx] && row[firstNameIdx] && row[lastNameIdx])
        .map(row => ({
          email: String(row[emailIdx]).trim(),
          password: String(row[passwordIdx]).trim(),
          first_name: String(row[firstNameIdx]).trim(),
          last_name: String(row[lastNameIdx]).trim(),
        }))
        .filter(user => 
          user.email && 
          user.password && 
          user.first_name && 
          user.last_name &&
          user.email.length > 0 &&
          user.password.length > 0 &&
          user.first_name.length > 0 &&
          user.last_name.length > 0
        );

      if (parsedUsers.length === 0) {
        setError('No valid user data found in Excel file. Please ensure all required fields are filled and not empty.');
        return;
      }

      // Validate passwords for Excel data
      const excelPasswordErrors = {};
      let hasPasswordErrors = false;
      parsedUsers.forEach((user, index) => {
        const validationError = validatePassword(user.password);
        if (validationError) {
          excelPasswordErrors[index] = validationError;
          hasPasswordErrors = true;
        }
      });

      if (hasPasswordErrors) {
        setError('Some passwords in the Excel file do not meet the requirements. Passwords must contain alphabets, special characters, and numbers.');
        setPasswordErrors(excelPasswordErrors);
        return;
      }

      setExcelData(parsedUsers);
      setUsers(parsedUsers);
      setShowExcelPreview(true);
      setError("");
      setPasswordErrors({}); // Clear any existing password errors
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Check for password validation errors
      const hasPasswordErrors = Object.values(passwordErrors).some(error => error !== null);
      if (hasPasswordErrors) {
        setError('Please fix password validation errors before submitting.');
        setLoading(false);
        return;
      }

      // Validate user data before sending
      const validUsers = users.filter(user => 
        user.email && 
        user.password && 
        user.first_name && 
        user.last_name &&
        user.email.trim() !== '' &&
        user.password.trim() !== '' &&
        user.first_name.trim() !== '' &&
        user.last_name.trim() !== ''
      );

      if (validUsers.length === 0) {
        setError('Please ensure all users have valid email, password, first name, and last name.');
        setLoading(false);
        return;
      }

      if (validUsers.length !== users.length) {
        setError(`Only ${validUsers.length} out of ${users.length} users have valid data. Please check all fields.`);
        setLoading(false);
        return;
      }

      let response;
      const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];

      // Always send as JSON array, whether from Excel or manual entry
      const payload = validUsers;
      
      response = await axios.post(
        `${API_BASE}/api/auth/admin/create-users`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.success) {
        setSuccess(true);
        setRecentlyAddedUsers(validUsers); // Track recently added users
        setAddedUsers(prev => {
          const updated = [...prev, ...validUsers];
          // Save to localStorage here for immediate persistence
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        
        setUsers([{ email: "", first_name: "", last_name: "", password: "" }]);
        setNumUsers(1);
        setExcelFile(null);
        setExcelData([]);
        setShowExcelPreview(false);
        setPasswordErrors({}); // Clear password errors on success
      } else {
        setError(response.data.message || "Failed to add users.");
      }
    } catch (err) {
      console.error('❌ Error adding users:', err);
      console.error('❌ Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.message || "Failed to add users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError("");
    setPasswordErrors({});
    setRecentlyAddedUsers([]);
    setUsers([{ email: "", first_name: "", last_name: "", password: "" }]);
    setNumUsers(1);
    setExcelFile(null);
    setExcelData([]);
    setShowExcelPreview(false);
  };

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 mb-8">
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-medium">Successfully added users!</p>
          </div>
          <p className="text-sm">
            {addedUsers.length} user(s) have been added to the system. 
            They should receive email notifications shortly and will appear in the Manage Users section.
          </p>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Add More Users
          </button>
          <button
            onClick={() => setShowUserList(!showUserList)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors font-medium"
          >
            {showUserList ? 'Hide User List' : 'View Added Users'}
          </button>
        </div>

        {/* Show recently added users */}
        {recentlyAddedUsers.length > 0 && (
          <div className="mb-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Recently Added Users ({recentlyAddedUsers.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-200">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-200">
                  {recentlyAddedUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Added Successfully
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showUserList && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Added Users ({addedUsers.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {addedUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 mb-8">
      {/* Heading and View Users button in the same row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Add New Users</h1>
          <p className="text-gray-600">Fill in the details for each user you want to add to the system</p>
        </div>
        <button
          onClick={() => setShowUserModal(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          View Users ({addedUsers.length})
        </button>
      </div>
      {/* User list modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Previously Added Users ({addedUsers.length})</h3>
            {addedUsers.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No users added yet.</div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {addedUsers.map((user, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded border">
                    <div className="font-medium text-gray-800">{user.first_name} {user.last_name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Users to Add (Manual Entry)</label>
          <select
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={numUsers}
            onChange={handleNumUsersChange}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <p className="text-sm text-gray-600 mt-2">For bulk uploads, use the Excel upload option below</p>
        </div>
        
        {/* Excel upload section - always visible */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-green-800 mb-1">📊 Bulk Upload with Excel</h3>
              <p className="text-xs text-green-700">
                Upload an Excel file with columns: 
                <span className="font-mono bg-green-100 px-1 mx-1 rounded">email</span>, 
                <span className="font-mono bg-green-100 px-1 mx-1 rounded">password</span>, 
                <span className="font-mono bg-green-100 px-1 mx-1 rounded">first_name</span> (or firstName), 
                <span className="font-mono bg-green-100 px-1 mx-1 rounded">last_name</span> (or lastName)
              </p>
            </div>
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-white border border-green-400 text-green-700 rounded-md text-sm font-medium hover:bg-green-50 transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Excel File
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Show Excel data preview if uploaded */}
        {showExcelPreview && excelData.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Excel Data Preview ({excelData.length} users)</h3>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {excelData.map((user, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.first_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.last_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Manual input fields - only show if not using Excel or for 1-10 users */}
        {(!showExcelPreview && numUsers <= 10) && (
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {users.map((user, idx) => (
              <div key={idx} className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">{idx + 1}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={user.email}
                      onChange={(e) => handleUserChange(idx, "email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="text"
                      placeholder="••••••••"
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        passwordErrors[idx] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      value={user.password}
                      onChange={(e) => handleUserChange(idx, "password", e.target.value)}
                      required
                    />
                    {passwordErrors[idx] && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {passwordErrors[idx]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={user.first_name}
                      onChange={(e) => handleUserChange(idx, "first_name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={user.last_name}
                      onChange={(e) => handleUserChange(idx, "last_name", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show summary for manual input when more than 10 users */}
        {(!showExcelPreview && numUsers > 10) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">You've selected to add {numUsers} users</h3>
            <p className="text-gray-600 mb-4">
              Please use the Excel upload option above for adding multiple users, 
              or reduce the number of users to 10 or fewer to enter details manually.
            </p>
          </div>
        )}

        <div className="pt-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          <button
            type="submit"
            className={`w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={loading || (!showExcelPreview && numUsers > 10)}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Add Users'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUsersForm;
//Development merged
//