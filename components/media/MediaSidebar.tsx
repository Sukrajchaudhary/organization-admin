import { Folder, MessageSquare, FileText, Calendar, Package } from "lucide-react";

const folders = ["All", "Testimonials", "Blogs", "Events", "Products"];
const folderIcons = [Folder, MessageSquare, FileText, Calendar, Package];

export function MediaSidebar() {
  return (
    <aside className="w-48 bg-muted border rounded-l-lg  border-border p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Folders</h3>
      <ul className="space-y-2">
        {folders.map((folder, index) => {
          const Icon = folderIcons[index];
          return (
            <li key={folder}>
              <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 w-full font-semibold cursor-pointer text-left px-3 py-2 rounded-lg transition-colors flex items-center">
                <Icon className="h-4 w-4 mr-2" />
                {folder}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}