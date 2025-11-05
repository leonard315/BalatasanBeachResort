import Image from 'next/image';
import Link from 'next/link';
import { getTours } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/star-rating';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';

export default function ToursPage() {
  const tours = getTours();

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Our Tour Packages
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore the natural wonders surrounding Balatasan. Adventure awaits!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          <Card key={tour.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="p-0">
                <Image
                  src={getPlaceholderImage(tour.images[0]).imageUrl}
                  alt={tour.tour_name}
                  width={600}
                  height={400}
                  className="aspect-video w-full object-cover"
                  data-ai-hint="tropical adventure"
                />
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-xl mb-2">
                  {tour.tour_name}
                </CardTitle>
                <Badge variant="secondary">{tour.tour_type.replace('_', ' ')}</Badge>
              </div>
              <CardDescription className="h-12 overflow-hidden text-ellipsis text-sm">
                {tour.description}
              </CardDescription>
               <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <StarRating rating={tour.rating} size={16} />
                    <span>({tour.reviews})</span>
                </div>
                 <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{tour.duration_hours} hours</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between bg-secondary/30 p-4">
              <div className="flex flex-col">
                <span className="font-bold text-lg">${tour.price_per_person.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">
                  per person
                </span>
              </div>
              <Button asChild>
                <Link href="#">Book Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
