
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface HeartConfession {
  id: string;
  dataUrl: string;
  text: string;
  date: string;
}

export function HeartGallery() {
  const [hearts, setHearts] = useState<HeartConfession[]>([]);
  const [selectedHeart, setSelectedHeart] = useState<HeartConfession | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchHearts();
  }, []);

  const fetchHearts = async () => {
    try {
      // Use schema method instead of dot notation
      const { data, error } = await supabase
        .schema('heart_db')
        .from('heart_confessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHearts = data.map(heart => ({
        id: heart.id,
        dataUrl: heart.image_data,
        text: heart.message || '',
        date: heart.created_at
      }));

      setHearts(formattedHearts);
    } catch (error) {
      console.error('Error fetching hearts:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Heart Confessions Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              {selectedHeart ? (
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src={selectedHeart.dataUrl}
                    alt="Heart confession"
                    className="max-w-full rounded-lg shadow-md"
                    style={{ maxHeight: "60vh" }}
                  />
                  <div className="text-center">
                    <p className="italic text-lg mt-2">"{selectedHeart.text}"</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      {new Date(selectedHeart.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <p className="text-center">Select a heart confession to view</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">Your Confessions</h3>
              {hearts.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">
                  No heart confessions yet. Create your first one!
                </p>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="flex flex-col space-y-3">
                    {hearts.map((heart) => (
                      <div
                        key={heart.id}
                        className={`cursor-pointer rounded-lg overflow-hidden border transition-all hover:shadow-md ${
                          selectedHeart?.id === heart.id
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() => setSelectedHeart(heart)}
                      >
                        <img
                          src={heart.dataUrl}
                          alt="Heart confession"
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(heart.date).toLocaleDateString()}
                          </p>
                          <p className="truncate text-sm">
                            {heart.text.substring(0, 30)}
                            {heart.text.length > 30 ? "..." : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
