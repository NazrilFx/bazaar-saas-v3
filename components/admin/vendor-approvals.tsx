import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Ivendor {
  name: string;
  email: string;
  description: string;
  phone: string;
  profile_image: string;
  business_type: string;
  contact_name: string;
  password_hash: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

interface AdminVendorApprovalsProps {
  vendors: Ivendor[] | null; // Bisa berupa array atau null
}

export function AdminVendorApprovals({ vendors }: AdminVendorApprovalsProps) {
  const [email, setEmail] = useState("");

  const reject = async () => {
    try {
      const res = await fetch("/api/admin/verified-vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");
    } catch (error: any) {
      console.error(error.message);
    } finally {
      console.log("Berhasil");
    }
  };

  if (vendors?.length == 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">All Caught Up!</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          There are no pending store approvals at the moment. New requests will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(vendors ?? []).map((vendor) => (
        <div
          key={vendor.email}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg bg-white"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={vendor.profile_image} alt={vendor.name} />
              <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{vendor.name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                <span>{vendor.email}</span>
                <span className="hidden sm:inline">•</span>
                <Badge variant="outline">{vendor.business_type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Submitted on {dayjs(vendor.created_at).fromNow()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => reject()}
            >
              <XCircle className="mr-1 h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
