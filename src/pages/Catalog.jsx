import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Clock, Search, Loader2, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllCatalogs, searchCatalogs, fetchCatalogCourses, testCatalogAPI } from "@/services/catalogService";

export function CatalogPage() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseCounts, setCourseCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  
  // Fetch catalogs from backend
  useEffect(() => {
    const fetchCatalogsAndCounts = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCatalogs();
        // console.log('Fetched catalogs:', data);
        // console.log('Data type:', typeof data);
        // console.log('Is array:', Array.isArray(data));
        setCatalogs(data || []);
        // Fetch course counts for each catalog
        const counts = {};
        await Promise.all(
          (data || []).map(async (catalog) => {
            const courses = await fetchCatalogCourses(catalog.id);
            counts[catalog.id] = courses.length;
          })
        );
        setCourseCounts(counts);
      } catch (err) {
        console.error("Failed to fetch catalogs:", err);
        setError("Failed to load catalogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogsAndCounts();
    
    // Test API endpoints for debugging
    testCatalogAPI().then(result => {
     // console.log('Catalog API test result:', result);
    });
  }, []);

  // Extract categories from fetched catalogs
  const categories = Array.from(new Set((catalogs || []).map(catalog => catalog.category || "General")));

  const filteredCatalogs = (catalogs || []).filter(catalog => {
    const matchesSearch = catalog.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         catalog.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           (catalog.category || "General") === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading catalogs...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Course Catalogs</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search catalogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[360px]"
                />
              </div>
              
              {/* Remove Select for All Categories and category filter logic */}
            </div>
          </div>
          
          {filteredCatalogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No catalogs found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalogs.map((catalog) => (
                <div key={catalog.id} className="group overflow-hidden rounded-lg border bg-card hover:shadow-md transition-all">
                  <div className="aspect-video w-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                    {catalog.thumbnail ? (
                      <img
                        src={catalog.thumbnail}
                        alt={catalog.name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ display: catalog.thumbnail ? 'none' : 'flex' }}
                    >
                      <FolderOpen className="h-16 w-16 text-blue-500" />
                    </div>
                    {/* Remove all Badge components that display catalog.category or 'General' in catalog cards */}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{catalog.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{catalog.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {courseCounts[catalog.id] || 0} courses
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Remove all Badge components that display catalog.category or 'General' in catalog cards */}
                      <span className="text-sm text-muted-foreground">
                        Created: {new Date(catalog.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <Button className="w-full mt-2" asChild>
                      <Link 
                        to={`/dashboard/catalog/${catalog.id}`}
                        state={{ catalog: catalog }}
                      >
                        View Courses
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CatalogPage;