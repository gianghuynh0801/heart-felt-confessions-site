import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Point {
  x: number;
  y: number;
}

export function HeartCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#FF1493");
  const [brushSize, setBrushSize] = useState(5);
  const [confessionText, setConfessionText] = useState("");
  const [heartData, setHeartData] = useState<{dataUrl: string, text: string} | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const colors = [
    "#FF1493", // Deep Pink
    "#FF69B4", // Hot Pink
    "#DC143C", // Crimson
    "#FF0000", // Red
    "#FFC0CB", // Pink
    "#FFB6C1", // Light Pink
    "#FF4500", // Orange Red
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a light heart shape as guidance
    drawHeartShape(ctx, canvas.width / 2, canvas.height / 2, 100, "#FFF0F5");
  }, []);

  const drawHeartShape = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number, 
    color: string
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Draw heart using bezier curves
    const topCurveHeight = size * 0.3;
    ctx.bezierCurveTo(
      x, y - topCurveHeight, // Control point
      x - size, y - topCurveHeight, // Control point
      x - size, y // End point
    );
    
    ctx.bezierCurveTo(
      x - size, y + size / 2, // Control point
      x, y + size, // Control point
      x, y + size // End point
    );
    
    ctx.bezierCurveTo(
      x, y + size, // Control point
      x + size, y + size / 2, // Control point
      x + size, y // End point
    );
    
    ctx.bezierCurveTo(
      x + size, y - topCurveHeight, // Control point
      x, y - topCurveHeight, // Control point
      x, y // End point
    );
    
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    setIsDrawing(true);
    
    const point = getPointFromEvent(e, canvas);
    if (!point) return;
    
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const point = getPointFromEvent(e, canvas);
    if (!point) return;
    
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPointFromEvent = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ): Point | null => {
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length > 0) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    
    return null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the heart shape guide
    drawHeartShape(ctx, canvas.width / 2, canvas.height / 2, 100, "#FFF0F5");
  };

  const saveHeart = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save heart confessions.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const dataUrl = canvas.toDataURL("image/png");
      
      // Use from() with the full table name including schema
      const { error } = await supabase
        .from('heart_confessions')
        .insert({
          image_data: dataUrl,
          message: confessionText,
          user_id: user.id
        });

      if (error) throw error;

      // Store in local storage for immediate display
      const savedHearts = JSON.parse(localStorage.getItem('savedHearts') || '[]');
      savedHearts.push({
        id: Date.now().toString(),
        dataUrl,
        text: confessionText,
        date: new Date().toISOString()
      });
      localStorage.setItem('savedHearts', JSON.stringify(savedHearts));

      setHeartData({
        dataUrl,
        text: confessionText
      });

      toast({
        title: "Heart Confession Saved!",
        description: "Your heart confession has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving heart:", error);
      toast({
        title: "Error",
        description: "Failed to save your heart confession.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-3xl">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-2xl text-primary">
            Draw Your Heart Confession
          </CardTitle>
          <CardDescription className="text-center">
            Express your feelings by drawing a unique heart with a message
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <canvas
              ref={canvasRef}
              className="w-full touch-none bg-white"
              style={{ height: "400px" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Brush Size: {brushSize}px
              </label>
              <Slider
                value={[brushSize]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => setBrushSize(value[0])}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex space-x-2">
                {colors.map((c) => (
                  <TooltipProvider key={c}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`w-8 h-8 rounded-full transition-transform ${
                            color === c ? "ring-2 ring-primary scale-110" : ""
                          }`}
                          style={{ backgroundColor: c }}
                          onClick={() => setColor(c)}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {c}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Confession Message
              </label>
              <textarea
                className="w-full p-2 border rounded-md text-foreground bg-background"
                rows={3}
                placeholder="Write your heartfelt message here..."
                value={confessionText}
                onChange={(e) => setConfessionText(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={clearCanvas}>
            Clear Canvas
          </Button>
          <Button onClick={saveHeart}>
            Save Confession
          </Button>
        </CardFooter>
      </Card>
      
      {heartData && (
        <Card className="w-full shadow-md p-4">
          <CardHeader>
            <CardTitle>Your Confession</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <img 
              src={heartData.dataUrl} 
              alt="Your heart confession" 
              className="max-w-xs rounded-md shadow-sm"
            />
            <p className="mt-4 text-center italic">"{heartData.text}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
