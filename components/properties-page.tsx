"use client";

import { useState } from "react";
import {
  Bath,
  Bed,
  Building,
  ExternalLink,
  Filter,
  Grid3X3,
  Heart,
  List,
  MapPin,
  MoreHorizontal,
  Plus,
  Ruler,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([200000, 1000000]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const properties = [
    {
      id: "1",
      title: "Modern Apartment with City View",
      address: "123 Main St, New York, NY 10001",
      price: 750000,
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      size: 1200,
      features: ["Balcony", "Gym", "Parking", "Doorman"],
      status: "For Sale",
      thumbnail: "/placeholder.svg?height=300&width=500",
      featured: true,
    },
    {
      id: "2",
      title: "Spacious Family Home",
      address: "456 Oak Ave, Los Angeles, CA 90001",
      price: 1250000,
      type: "House",
      bedrooms: 4,
      bathrooms: 3,
      size: 2800,
      features: ["Garden", "Pool", "Garage", "Fireplace"],
      status: "For Sale",
      thumbnail: "/placeholder.svg?height=300&width=500",
      featured: false,
    },
    {
      id: "3",
      title: "Downtown Loft",
      address: "789 Urban St, Chicago, IL 60007",
      price: 3500,
      type: "Loft",
      bedrooms: 1,
      bathrooms: 1,
      size: 950,
      features: ["High Ceilings", "Exposed Brick", "Hardwood Floors"],
      status: "For Rent",
      thumbnail: "/placeholder.svg?height=300&width=500",
      featured: true,
    },
    {
      id: "4",
      title: "Waterfront Condo",
      address: "101 Beach Rd, Miami, FL 33101",
      price: 890000,
      type: "Condo",
      bedrooms: 3,
      bathrooms: 2,
      size: 1800,
      features: ["Ocean View", "Pool", "Gym", "Security"],
      status: "For Sale",
      thumbnail: "/placeholder.svg?height=300&width=500",
      featured: true,
    },
    {
      id: "5",
      title: "Suburban Townhouse",
      address: "222 Maple Dr, Seattle, WA 98101",
      price: 4200,
      type: "Townhouse",
      bedrooms: 3,
      bathrooms: 2.5,
      size: 1950,
      features: ["Backyard", "Garage", "Newly Renovated"],
      status: "For Rent",
      thumbnail: "/placeholder.svg?height=300&width=500",
      featured: false,
    },
    {
      id: "6",
      title: "Historic Brownstone",
      address: "333 Heritage Ln, Boston, MA 02108",
      price: 1750000,
      type: "House",
      bedrooms: 5,
      bathrooms: 3,
      size: 3200,
      features: ["Original Details", "Garden", "Fireplace", "Basement"],
      status: "For Sale",
      thumbnail: "/placeholder.svg?height=300&width=500",
      featured: false,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Properties
                </h1>
                <p className="text-muted-foreground">
                  Browse our available properties for sale and rent
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-muted" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Filter Properties</DialogTitle>
                      <DialogDescription>
                        Refine your search with specific criteria
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Property Type</Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "House",
                            "Apartment",
                            "Condo",
                            "Townhouse",
                            "Loft",
                          ].map((type) => (
                            <div
                              key={type}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox id={`type-${type}`} />
                              <label htmlFor={`type-${type}`} />
                              <label
                                htmlFor={`type-${type}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Status</Label>
                        <RadioGroup defaultValue="all">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="status-all" />
                            <Label htmlFor="status-all">All</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="for-sale"
                              id="status-for-sale"
                            />
                            <Label htmlFor="status-for-sale">For Sale</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="for-rent"
                              id="status-for-rent"
                            />
                            <Label htmlFor="status-for-rent">For Rent</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <Label>Price Range</Label>
                          <span className="text-sm text-muted-foreground">
                            ${priceRange[0].toLocaleString()} - $
                            {priceRange[1].toLocaleString()}
                          </span>
                        </div>
                        <Slider
                          defaultValue={priceRange}
                          max={2000000}
                          min={0}
                          step={10000}
                          onValueChange={setPriceRange}
                          className="py-4"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Select>
                            <SelectTrigger id="bedrooms">
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                              <SelectItem value="5">5+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Select>
                            <SelectTrigger id="bathrooms">
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="size">Min Size (sq ft)</Label>
                          <Input id="size" type="number" placeholder="Any" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Reset</Button>
                      <Button>Apply Filters</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Property
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Property</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new property listing
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Property Title</Label>
                        <Input
                          id="title"
                          placeholder="Modern Apartment with City View"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="123 Main St, New York, NY 10001"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price</Label>
                          <Input id="price" placeholder="750000" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="status">Status</Label>
                          <Select>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="for-sale">For Sale</SelectItem>
                              <SelectItem value="for-rent">For Rent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Input id="bedrooms" type="number" placeholder="2" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input id="bathrooms" type="number" placeholder="2" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="size">Size (sq ft)</Label>
                          <Input id="size" type="number" placeholder="1200" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Property Type</Label>
                        <Select>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="loft">Loft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Property</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Properties</TabsTrigger>
                <TabsTrigger value="for-sale">For Sale</TabsTrigger>
                <TabsTrigger value="for-rent">For Rent</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                {viewMode === "grid" ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isFavorite={favorites.includes(property.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <PropertyListItem
                        key={property.id}
                        property={property}
                        isFavorite={favorites.includes(property.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="for-sale" className="mt-4">
                {viewMode === "grid" ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties
                      .filter((property) => property.status === "For Sale")
                      .map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(property.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties
                      .filter((property) => property.status === "For Sale")
                      .map((property) => (
                        <PropertyListItem
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(property.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="for-rent" className="mt-4">
                {viewMode === "grid" ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties
                      .filter((property) => property.status === "For Rent")
                      .map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(property.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties
                      .filter((property) => property.status === "For Rent")
                      .map((property) => (
                        <PropertyListItem
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(property.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="featured" className="mt-4">
                {viewMode === "grid" ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties
                      .filter((property) => property.featured)
                      .map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(property.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties
                      .filter((property) => property.featured)
                      .map((property) => (
                        <PropertyListItem
                          key={property.id}
                          property={property}
                          isFavorite={favorites.includes(property.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="favorites" className="mt-4">
                {favorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Heart className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">
                      No favorites yet
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click the heart icon on any property to add it to your
                      favorites
                    </p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties
                      .filter((property) => favorites.includes(property.id))
                      .map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isFavorite={true}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties
                      .filter((property) => favorites.includes(property.id))
                      .map((property) => (
                        <PropertyListItem
                          key={property.id}
                          property={property}
                          isFavorite={true}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
    </div>
  );
}

interface PropertyCardProps {
  property: any;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={property.thumbnail || "/placeholder.svg"}
            alt={property.title}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
        {property.featured && (
          <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            Featured
          </div>
        )}
        <div
          className={`absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium ${
            property.status === "For Sale"
              ? "bg-blue-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {property.status}
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1">{property.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {property.address}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Listing</DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Delete Listing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="text-lg font-semibold">
          {property.status === "For Sale"
            ? `$${property.price.toLocaleString()}`
            : `$${property.price.toLocaleString()}/month`}
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Beds</span>
            <span className="font-medium flex items-center gap-1">
              <Bed className="h-3 w-3" /> {property.bedrooms}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Baths</span>
            <span className="font-medium flex items-center gap-1">
              <Bath className="h-3 w-3" /> {property.bathrooms}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Size</span>
            <span className="font-medium flex items-center gap-1">
              <Ruler className="h-3 w-3" /> {property.size} ft²
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 pt-2">
          {Array.isArray(property.features) &&
            property.features
              .slice(0, 3)
              .map((feature: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                >
                  {feature}
                </span>
              ))}
          {Array.isArray(property.features) && property.features.length > 3 && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              +{property.features.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full gap-1">
          <ExternalLink className="h-3.5 w-3.5" />
          View Details
        </Button>
        <Button size="sm" className="w-full">
          {property.status === "For Sale" ? "Contact Agent" : "Schedule Tour"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function PropertyListItem({
  property,
  isFavorite,
  onToggleFavorite,
}: PropertyCardProps) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-1/3 md:w-1/4">
          <div className="aspect-[16/9] sm:aspect-auto sm:h-full w-full overflow-hidden">
            <img
              src={property.thumbnail || "/placeholder.svg"}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>
          {property.featured && (
            <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              Featured
            </div>
          )}
          <div
            className={`absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium ${
              property.status === "For Sale"
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {property.status}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{property.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {property.address}
              </p>
            </div>
            <div className="text-lg font-semibold">
              {property.status === "For Sale"
                ? `$${property.price.toLocaleString()}`
                : `$${property.price.toLocaleString()}/month`}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{property.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span>{property.size} ft²</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {Array.isArray(property.features) &&
              property.features.map((feature: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                >
                  {feature}
                </span>
              ))}
          </div>
          <div className="mt-auto pt-4 flex gap-2 justify-end">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button size="sm">
              {property.status === "For Sale"
                ? "Contact Agent"
                : "Schedule Tour"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
