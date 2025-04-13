"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CreditCard,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { StorePOSProductCard } from "@/components/store/pos-product-card";
import { StorePOSPaymentModal } from "@/components/store/pos-payment-modal";
import { StorePOSProductDetailModal } from "@/components/store/pos-product-detail-modal";
import Link from "next/link";
import Loading from "@/components/loading";
import { loadSnapScript } from "@/utils/loadSnapScript";

export interface IOrderItem {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

interface CartItem extends IProduct {
  quantity: number;
}

// These are products specific to this store
// const storeProducts: IProduct[] = [
//   {
//     id: "prod1",
//     name: "Organic Salad Bowl",
//     price: 12.99,
//     category: "Food",
//     description: "Fresh organic greens with a variety of toppings and house-made dressing.",
//     image: "/placeholder.svg?height=120&width=120&text=Salad",
//   },
//   {
//     id: "prod2",
//     name: "Fresh Fruit Smoothie",
//     price: 8.5,
//     category: "Beverages",
//     description: "Blend of seasonal fruits with yogurt and honey.",
//     image: "/placeholder.svg?height=120&width=120&text=Smoothie",
//   },
//   {
//     id: "prod3",
//     name: "Vegan Protein Bar",
//     price: 4.99,
//     category: "Snacks",
//     description: "Plant-based protein bar with nuts, seeds, and dried fruits.",
//     image: "/placeholder.svg?height=120&width=120&text=Protein+Bar",
//   },
//   {
//     id: "prod4",
//     name: "Gluten-Free Cookies",
//     price: 6.75,
//     category: "Desserts",
//     description: "Delicious cookies made with gluten-free flour and organic chocolate chips.",
//     image: "/placeholder.svg?height=120&width=120&text=Cookies",
//   },
//   {
//     id: "prod5",
//     name: "Organic Green Tea",
//     price: 5.25,
//     category: "Beverages",
//     description: "Premium organic green tea, served hot or iced.",
//     image: "/placeholder.svg?height=120&width=120&text=Tea",
//   },
//   {
//     id: "prod6",
//     name: "Avocado Toast",
//     price: 10.5,
//     category: "Food",
//     description: "Whole grain toast topped with fresh avocado, microgreens, and spices.",
//     image: "/placeholder.svg?height=120&width=120&text=Avocado+Toast",
//   },
// ]

export function StorePOSInterface() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [storeName, setStoreName] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [vendorEmail, setVendorEmail] = useState<string | null>(null);
  const [vendorPhone, setVendorPhone] = useState<string | null>(null);
  // const [orderItems, setOrderItems] = useState<IOrderItem[] | []>([])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/store-pos/dashboard"); // Fetch dari API Next.js
        const data = await res.json();

        if (res.ok) {
          setStoreName(data.storeName);
          setProducts(data.products);
          setCategories(["All", ...data.categories]);
          setVendorEmail(data.vendorEmail);
          setVendorPhone(data.vendorPhone);
        } else {
          setProducts([]);
          setVendorEmail(null);
          setVendorPhone(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser().then(() => setLoading(false));

    loadSnapScript()
      .then(() => setLoading(false))
      .catch((err) => console.error(err));
  }, []);

    if (loading) {
    return <Loading />;
  }

  if (!loading && (!vendorEmail || !vendorPhone)) {
    return <div>Vendor&apos;s email and phone not found</div>;
  }  
  const filteredProducts = products.filter(
    (product) =>
      (activeCategory === "All" || product.category === activeCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: IProduct, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleViewProductDetails = (product: IProduct) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  // function untuk seleksi beberapa transaction_status di midtrans menjadi data yang valid di database
  function mapMidtransStatusToAppStatus(transaction_status: string): "pending" | "paid" | "canceled" {
    switch (transaction_status) {
      case "settlement":
      case "capture":
        return "paid";
      case "pending":
        return "pending";
      case "cancel":
      case "deny":
      case "expire":
      case "failure":
        return "canceled";
      default:
        return "pending"; // fallback default
    }
  }

  const handleMidtransPay = async () => {
    if (!vendorEmail || typeof vendorPhone !== "string") {
      alert("email tidak ada");
    }

    if (!vendorPhone || typeof vendorPhone !== "string") {
      alert("Nomor HP tidak valid atau tidak tersedia");
    }

    const filteredOrderItems: IOrderItem[] = cart
  .filter((item) => item.quantity > 0) // ← filter item yang quantity > 0
  .map((item) => ({
    product_id: item.id.toString(),
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

    try {
      const res = await fetch("/api/midtrans/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: { storeName }, // name bisa diinput dari user
          email: vendorEmail, // email user
          phone: vendorPhone, // nomor HP user
          tax: tax,
          amount: total, // total pembayaran
          items: filteredOrderItems,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Telah terjadi error saat membuat order : ' + data)
        return false
      }

      const createOrderRes = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: storeName,
          midtrans_token: data.token,
          customer_email: vendorEmail,
          status: "pending",
          items: filteredOrderItems,
          total_amount: total,
          tax_amount: tax,
          payment_method: "pending",
        }),
      });

      const dataOrder = await createOrderRes.json()

      if (!createOrderRes.ok) (
        console.error('Telah terjadi error saat membuat order : ' + dataOrder)
      )

      if (data.token) {
        // Lanjutkan ke Snap Midtrans payment popup
        window.snap.pay(data.token, {
          onSuccess: async (result) => {
            setCart([]);
            const status = mapMidtransStatusToAppStatus(result.transaction_status)
            const updateOrderRes = await fetch("/api/order/update-status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: dataOrder.order._id.toString(),
                status,
                payment_method: result.payment_type,
              })
            })

            const dataUpdateOrder = await updateOrderRes.json()

            if (!updateOrderRes.ok) {
              console.error("telah terjadi error saat mengupdate", dataUpdateOrder)
              console.log(dataUpdateOrder)
            } else {
              console.log("update order berhasil", dataUpdateOrder)
            }
          },
          onPending: async (result) => {
            setCart([]);
            const status = mapMidtransStatusToAppStatus(result.transaction_status)
            const updateOrderRes = await fetch("/api/order/update-status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: dataOrder.order._id.toString(),
                status,
                payment_method: result.payment_type,
              })
            })

            const dataUpdateOrder = await updateOrderRes.json()

            if (!updateOrderRes.ok) {
              console.error("telah terjadi error saat mengupdate", dataUpdateOrder)
              console.log(dataUpdateOrder)
            } else {
              console.log("update order berhasil", dataUpdateOrder)
            }
          },
          onError: async (result) => {
            setCart([]);
            const status = mapMidtransStatusToAppStatus(result.transaction_status)
            const updateOrderRes = await fetch("/api/order/update-status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: dataOrder.order._id.toString(),
                status,
                payment_method: result.payment_type,
              })
            })

            const dataUpdateOrder = await updateOrderRes.json()

            if (!updateOrderRes.ok) {
              console.error("telah terjadi error saat mengupdate", dataUpdateOrder)
              console.log(dataUpdateOrder)
            } else {
              console.log("update order berhasil", dataUpdateOrder)
            }
          },
          onClose: async () => {
            setCart([]);
            alert("Halaman pembayaran ditutup, silahkan melakukan pembayaran")
          },
        });
      } else {
        console.warn("Token tidak tersedia, response:", data);
        alert("Gagal membuat transaksi");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      {/* Products Section */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/store">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Organic Delights POS</h1>
              <Badge className="bg-store-primary text-white">Store Mode</Badge>
            </div>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto pb-2">
            <Tabs
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList className="w-full justify-start">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="px-4 py-2"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-store-muted/30">
          {filteredProducts.map((product) => (
            <StorePOSProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
              onViewDetails={() => handleViewProductDetails(product)}
            />
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Products Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1">
                Try adjusting your search or filter to find what you&apos;re
                looking for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full md:w-[400px] bg-white border-t md:border-t-0 md:border-l flex flex-col h-full">
        <Card className="flex flex-col h-full border-0 rounded-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Order</CardTitle>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="h-8 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1">
                  Add some products to your cart to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col border-t pt-4">
            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full mt-4 bg-store-primary hover:bg-store-secondary text-white"
                size="lg"
                disabled={cart.length === 0}
                // onClick={() => setIsPaymentModalOpen(true)}
                onClick={handleMidtransPay}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Payment
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <StorePOSPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={total}
        onPaymentComplete={() => {
          setIsPaymentModalOpen(false);
          clearCart();
        }}
      />

      <StorePOSProductDetailModal
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
      />
    </div>
  );
}
