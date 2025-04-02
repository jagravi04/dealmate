
import React from "react";
import { Link } from "react-router-dom";
import { File, MessageSquare, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Deal } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface DealCardProps {
  deal: Deal;
}

const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "in_progress":
        return "deal-status-in-progress";
      case "completed":
        return "deal-status-completed";
      case "cancelled":
        return "deal-status-cancelled";
      case "pending":
      default:
        return "deal-status-pending";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Link to={`/deals/${deal.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold line-clamp-1">{deal.title}</h3>
              <div className="flex items-center space-x-2">
                <Badge
                  className={getStatusBadgeVariant(deal.status)}
                  variant="outline"
                >
                  {deal.status.replace("_", " ")}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(deal.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {deal.description}
          </p>
          
          <div className="flex justify-between items-center mt-3">
            <span className="font-medium text-lg">{formatPrice(deal.currentPrice)}</span>
            {deal.initialPrice !== deal.currentPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(deal.initialPrice)}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between border-t mt-2">
          <div className="flex items-center space-x-1 text-muted-foreground text-xs mt-2">
            <File className="h-3.5 w-3.5" />
            <span>{deal.documents.length}</span>
          </div>

          <div className="flex space-x-1 items-center">
            <div className="flex -space-x-2">
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarImage src={deal.buyer.avatarUrl} alt={deal.buyer.name} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(deal.buyer.name)}
                </AvatarFallback>
              </Avatar>
              
              {deal.seller && (
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={deal.seller.avatarUrl} alt={deal.seller.name} />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(deal.seller.name)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            
            {!deal.seller && (
              <Badge variant="outline" className="h-5 text-[10px] px-1 bg-muted">
                <User className="h-3 w-3 mr-1" />
                Needs Seller
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DealCard;
