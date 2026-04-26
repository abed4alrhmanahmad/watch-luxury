import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

export function StarRating({ value, interactive = false, onChange, readOnly = false }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = interactive && hoverValue > 0 ? hoverValue : Math.round(value);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(0)}
          disabled={readOnly || !interactive}
          className={`transition-all ${interactive && !readOnly ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${readOnly ? 'cursor-default' : ''}`}
        >
          <Star
            size={20}
            className={`${
              star <= displayValue
                ? 'fill-gold text-gold'
                : 'text-muted-foreground'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}
