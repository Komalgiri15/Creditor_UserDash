import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Clock, Calendar } from "lucide-react";

function formatDuration(secs) {
  if (!secs) return "Duration not specified";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

export function CourseCard({
  id,
  title,
  description,
  image,
  modulesCount,
  totalDurationSecs,
  category,
  isUpcoming = false
}) {

  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-col overflow-hidden rounded-lg border bg-card min-h-[220px]">
        <div className="w-full relative overflow-hidden bg-muted" style={{height: '110px'}}>
          <img
            src={image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"}
            alt={title}
            className="object-cover w-full h-full"
            style={{height: '110px'}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0"></div>
          <Badge 
            variant="secondary" 
            className="absolute top-1 right-1 text-xs px-2 py-0.5"
          >
            {category}
          </Badge>
        </div>
        <div className="flex flex-col flex-1 p-3 relative">
          <h3 className="font-semibold text-base line-clamp-1">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-xs mt-1 mb-2">{description}</p>
          
          {!isUpcoming && (
            <div className="flex items-center text-xs text-muted-foreground gap-3 mt-auto">
              <div className="flex items-center gap-1">
                <BookOpen size={12} />
                <span>{modulesCount || 0} modules</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{formatDuration(totalDurationSecs)}</span>
              </div>
            </div>
          )}
          
          {isUpcoming ? (
            <div className="mt-auto pt-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Stay tuned for more details</p>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 text-sm font-medium">
                  <Calendar size={14} />
                  Coming Soon
                </div>
              </div>
            </div>
          ) : (
            <button
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-200"
              onClick={() => navigate(`/dashboard/courses/${id}`)}
            >
              View Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;