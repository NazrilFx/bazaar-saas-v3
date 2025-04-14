"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Package,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { StoreProductsList } from "@/components/store/products-list";
import { StoreRecentOrders } from "@/components/store/recent-orders";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IProduct } from "@/components/store/products-list";
import { IOrder } from "@/models/Order";
import Loading from "@/components/loading";

export default function StoreDashboard() {
  const router = useRouter();

  const [latestFourProducts, setLatestFourProducts] = useState<IProduct[] | []>(
    []
  );
  const [products, setProducts] = useState(0);
  const [productsOutOfStock, setProductsOutOfStock] = useState(0);
  const [recentOrders, setRecentOrders] = useState<IOrder[] | []>([]);
  const [ordersLastMonth, setOrdersLastMonth] = useState(0);
  const [ordersThisMonth, setOrdersThisMonth] = useState(0);
  const [totalSalesThisMonth, setTotalSalesThisMonth] = useState(0);
  const [totalSalesLastMonth, setTotalSalesLastMonth] = useState(0);
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalStock, setModalStock] = useState(false);
  const [modalPrice, setModalPrice] = useState(false);
  const [stockUpdate, setStockUpdate] = useState<number | null>(null);
  const [priceUpdate, setPriceUpdate] = useState<number | null>(null);
  const [targetProductId, setTargetProductId] = useState("");

  const [salesGrowth, setSalesGrowth] = useState(0);
  const [isSalesGrowth, setIsSalesGrowth] = useState(false);
  const [orderGrowth, setOrderGrowth] = useState(0);
  const [isOrderGrowth, setIsOrderGrowth] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/store/dashboard"); // Fetch dari API Next.js
        const data = await res.json();

        if (res.ok) {
          setLatestFourProducts(data.latestFourProducts);
          setProducts(data.products);
          setProductsOutOfStock(data.productsOutOfStock);
          setRecentOrders(data.recentOrders);
          setOrdersLastMonth(data.ordersLastMonth);
          setOrdersThisMonth(data.ordersThisMonth);
          setTotalSalesThisMonth(data.totalSalesThisMonth);
          setTotalSalesLastMonth(data.totalSalesLastMonth);
        } else {
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));

    fetchUser().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    const growth =
      totalSalesLastMonth === 0
        ? 100
        : ((totalSalesThisMonth - totalSalesLastMonth) / totalSalesLastMonth) *
          100;

    setSalesGrowth(growth);
    setIsSalesGrowth(growth >= 0);
    console.log(totalSalesLastMonth);
  }, [totalSalesThisMonth, totalSalesLastMonth]);

  useEffect(() => {
    const growth =
      ordersLastMonth === 0
        ? 100
        : ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100;

    setOrderGrowth(growth);
    setIsOrderGrowth(growth >= 0);
    console.log(ordersLastMonth);
  }, [ordersThisMonth, ordersLastMonth]);

  const updateStock = async (id: string, stock: number) => {
    setModalStock(true);
    setTargetProductId(id);
    setStockUpdate(stock);
  };

  const editPrice = async (id: string, price: number) => {
    setModalPrice(true);
    setTargetProductId(id);
    setPriceUpdate(price);
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (targetProductId == "") {
      throw new Error("Target product not found");
    }

    try {
      const res = await fetch("/api/product/update/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetProductId,
          stock: stockUpdate ?? 0,
          csrfToken,
        }),
        redirect: "manual",
      });

      const data = await res.json();

      // Cek apakah response adalah JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response");
      }

      if (!res.ok) throw new Error(data.message || "Create failed");
    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Update error :", error);
    } finally {
      setTargetProductId("");
      window.location.reload();
    }
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (targetProductId == "") {
      throw new Error("Target product not found");
    }

    if (!priceUpdate || priceUpdate == 0) {
      throw new Error("Price not valid");
    }

    try {
      const res = await fetch("/api/product/update/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetProductId,
          price: priceUpdate,
          csrfToken,
        }),
        redirect: "manual",
      });

      const data = await res.json();

      // Cek apakah response adalah JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response");
      }

      if (!res.ok) throw new Error(data.message || "Create failed");
      console.log(data);
    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Update error :", error);
    } finally {
      setTargetProductId("");
      window.location.reload();
    }
  };

  if (loading) return <Loading />;

    // Modal untuk update stock
    if (modalStock) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Update Stock</h2>
            <form>
              <input
                type="number"
                value={stockUpdate ?? ""}
                onChange={(e) =>
                  setStockUpdate(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                placeholder="placeholder"
                className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-300 bg-white"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalStock(false)}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStock}
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  save
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  
    // Modal untuk update price
    if (modalPrice) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Update Price</h2>
            <form>
              <input
                type="number"
                value={priceUpdate ?? ""}
                onChange={(e) =>
                  setPriceUpdate(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                placeholder="placeholder"
                className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-300 bg-white"
                required
              />
              {priceUpdate && (
                <div className="text-sm my-2 bg-blue-50">
                  Rp {new Intl.NumberFormat("id-ID").format(priceUpdate)}
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalPrice(false)}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePrice}
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  save
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Store Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your products, inventory, and orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/store/pos">
            <Button
              variant="outline"
              className="bg-store-primary text-white hover:bg-store-secondary border-none"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Open POS
            </Button>
          </Link>
          <Button
            onClick={() => {
              router.push("/store/products/create");
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSalesThisMonth.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span
                className={`${
                  isSalesGrowth ? "text-green-500" : "text-red-500"
                } flex items-center`}
              >
                {isSalesGrowth ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <ArrowUpRight className="h-3 w-3 mr-1" />{" "}
                {Math.abs(salesGrowth).toFixed(2)}%
              </span>
              <span className="ml-1">from yesterday</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {productsOutOfStock} out of stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersThisMonth}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span
                className={`${
                  isOrderGrowth ? "text-green-500" : "text-red-500"
                } flex items-center`}
              >
                {isOrderGrowth ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <ArrowUpRight className="h-3 w-3 mr-1" />{" "}
                {Math.abs(orderGrowth).toFixed(2)}%
              </span>
              <span className="ml-1">from yesterday</span>
            </p>
          </CardContent>
        </Card>

        {/* Card untuk inventory */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across 24 products
            </p>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your product listings and inventory
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                router.push("/store/products/create");
              }}
              variant="outline"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </CardHeader>
          <CardContent>
            <StoreProductsList
              status="all"
              products={latestFourProducts}
              edit={(id) => router.push(`/store/products/edit/${id}`)}
              updateStock={updateStock}
              editPrice={editPrice}
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/store/products")}>
              View All Products 
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest customer orders for your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoreRecentOrders orders={recentOrders} />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
          <CardDescription>
            Your store&apos;s performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales">
            <TabsList className="mb-4">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
            <TabsContent value="sales">
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Sales analytics chart will appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="products">
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Product performance chart will appear here
                </p>
              </div>
            </TabsContent>
            <TabsContent value="customers">
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Customer demographics chart will appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
