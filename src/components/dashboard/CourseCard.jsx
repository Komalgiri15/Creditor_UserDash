import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { BookOpen, Clock } from "lucide-react";

export function CourseCard({
  id,
  title,
  description,
  image,
  progress,
  lessonsCount,
  category,
  duration
}) {
  return (
    <div>
      <Link 
        to={`/courses/${id}`}
        className="flex flex-col overflow-hidden rounded-lg border bg-card"
      >
        <div className="aspect-video w-full relative overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0"></div>
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2"
          >
            {category}
          </Badge>
        </div>
        
        <div className="flex flex-col flex-1 p-4 relative">
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm mt-1 mb-4">{description}</p>
          <div className="flex items-center text-sm text-muted-foreground gap-4 mt-auto">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>{lessonsCount} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              indicatorClassName="bg-gradient-to-r from-primary to-purple-400"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CourseCard;