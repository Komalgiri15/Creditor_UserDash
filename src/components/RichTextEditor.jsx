// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import { Color } from '@tiptap/extension-color';
// import TextStyle from '@tiptap/extension-text-style';
// import Placeholder from '@tiptap/extension-placeholder';
// import { Button } from '@/components/ui/button';
// import { Toggle } from '@/components/ui/toggle';
// import { Separator } from '@/components/ui/separator';
// import {
//   Bold,
//   Italic,
//   Underline as UnderlineIcon,
//   Strikethrough,
//   List,
//   ListOrdered,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   AlignJustify,
//   Palette,
//   ChevronDown,
//   Check,
// } from 'lucide-react';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';

// const COLORS = [
//   { name: 'Default', value: 'inherit' },
//   { name: 'Gray', value: '#9CA3AF' },
//   { name: 'Red', value: '#EF4444' },
//   { name: 'Orange', value: '#F97316' },
//   { name: 'Yellow', value: '#F59E0B' },
//   { name: 'Green', value: '#10B981' },
//   { name: 'Blue', value: '#3B82F6' },
//   { name: 'Purple', value: '#8B5CF6' },
//   { name: 'Pink', value: '#EC4899' },
// ];

// const RichTextEditor = ({
//   content = '',
//   onChange,
//   placeholder = 'Start typing here...',
//   className,
// }) => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         bulletList: {
//           HTMLAttributes: {
//             class: 'list-disc pl-5',
//           },
//         },
//         orderedList: {
//           HTMLAttributes: {
//             class: 'list-decimal pl-5',
//           },
//         },
//       }),
//       Underline,
//       TextAlign.configure({
//         types: ['heading', 'paragraph'],
//       }),
//       TextStyle,
//       Color,
//       Placeholder.configure({
//         placeholder,
//       }),
//     ],
//     content,
//     onUpdate: ({ editor }) => {
//       const html = editor.getHTML();
//       onChange(html);
//     },
//   });

//   if (!editor) {
//     return null;
//   }

//   const setLink = () => {
//     const previousUrl = editor.getAttributes('link').href;
//     const url = window.prompt('URL', previousUrl);

//     if (url === null) {
//       return;
//     }

//     if (url === '') {
//       editor.chain().focus().extendMarkRange('link').unsetLink().run();
//       return;
//     }

//     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };

//   const setColor = (color) => {
//     editor.chain().focus().setColor(color).run();
//   };

//   const currentColor = editor.getAttributes('textStyle').color || 'inherit';

//   return (
//     <div className={cn('rounded-md border border-input', className)}>
//       <div className="flex flex-wrap items-center gap-1 border-b p-1">
//         <Toggle
//           size="sm"
//           pressed={editor.isActive('bold')}
//           onPressedChange={() => editor.chain().focus().toggleBold().run()}
//           className="h-8 w-8 p-0"
//         >
//           <Bold className="h-4 w-4" />
//         </Toggle>
//         <Toggle
//           size="sm"
//           pressed={editor.isActive('italic')}
//           onPressedChange={() => editor.chain().focus().toggleItalic().run()}
//           className="h-8 w-8 p-0"
//         >
//           <Italic className="h-4 w-4" />
//         </Toggle>
//         <Toggle
//           size="sm"
//           pressed={editor.isActive('underline')}
//           onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
//           className="h-8 w-8 p-0"
//         >
//           <UnderlineIcon className="h-4 w-4" />
//         </Toggle>
//         <Toggle
//           size="sm"
//           pressed={editor.isActive('strike')}
//           onPressedChange={() => editor.chain().focus().toggleStrike().run()}
//           className="h-8 w-8 p-0"
//         >
//           <Strikethrough className="h-4 w-4" />
//         </Toggle>
        
//         <Separator orientation="vertical" className="mx-1 h-6" />
        
//         <Toggle
//           size="sm"
//           pressed={editor.isActive('bulletList')}
//           onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
//           className="h-8 w-8 p-0"
//         >
//           <List className="h-4 w-4" />
//         </Toggle>
//         <Toggle
//           size="sm"
//           pressed={editor.isActive('orderedList')}
//           onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
//           className="h-8 w-8 p-0"
//         >
//           <ListOrdered className="h-4 w-4" />
//         </Toggle>
        
//         <Separator orientation="vertical" className="mx-1 h-6" />
        
//         <Toggle
//           size="sm"
//           pressed={editor.isActive({ textAlign: 'left' })}
//           onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
//           className="h-8 w-8 p-0"
//         >
//           <AlignLeft className="h-4 w-4" />
//         </Toggle>
//         <Toggle
//           size="sm"
//           pressed={editor.isActive({ textAlign: 'center' })}
//           onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
//           className="h-8 w-8 p-0"
//         >
//           <AlignCenter className="h-4 w-4" />
//         </Toggle>
//         <Toggle
//           size="sm"
//           pressed={editor.isActive({ textAlign: 'right' })}
//           onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
//           className="h-8 w-8 p-0"
//         >
//           <AlignRight className="h-4 w-4" />
//         </Toggle>
//         <Toggle
//           size="sm"
//           pressed={editor.isActive({ textAlign: 'justify' })}
//           onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
//           className="h-8 w-8 p-0"
//         >
//           <AlignJustify className="h-4 w-4" />
//         </Toggle>
        
//         <Separator orientation="vertical" className="mx-1 h-6" />
        
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
//               <Palette className="h-4 w-4" />
//               <ChevronDown className="h-4 w-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-48 p-2">
//             <div className="grid grid-cols-3 gap-1">
//               {COLORS.map((color) => (
//                 <button
//                   key={color.value}
//                   type="button"
//                   className="flex h-6 w-full items-center justify-center rounded-md hover:bg-gray-100"
//                   onClick={() => setColor(color.value)}
//                 >
//                   <div
//                     className="h-4 w-4 rounded-full border"
//                     style={{ backgroundColor: color.value }}
//                   />
//                   {currentColor === color.value && (
//                     <Check className="absolute h-4 w-4 text-gray-900" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           </PopoverContent>
//         </Popover>
        
//         <Button
//           variant="ghost"
//           size="sm"
//           className="h-8 px-2 text-xs"
//           onClick={setLink}
//         >
//           Link
//         </Button>
//       </div>
//       <div className="prose max-w-none p-4 focus:outline-none">
//         <EditorContent editor={editor} className="min-h-[200px]" />
//       </div>
//     </div>
//   );
// };

// export default RichTextEditor;
