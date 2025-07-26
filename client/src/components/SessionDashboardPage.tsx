import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionDashboard } from "@/components/SessionDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, Target } from "lucide-react";

export default function SessionDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Dashboard</h1>
          <p className="text-gray-600">Track your speaking practice progress with numbered sessions</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 gap-2 mb-8 h-auto p-2 bg-white border border-gray-200 shadow-sm rounded-xl">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-bold">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sessions" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-bold">All Sessions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="goals" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <Target className="w-5 h-5" />
              <span className="font-bold">Goals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SessionDashboard />
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Practice Sessions</CardTitle>
                <CardDescription>
                  View all your numbered practice sessions with detailed metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Complete session history will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Speaking Goals</CardTitle>
                <CardDescription>
                  Set and track your speaking improvement goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Goal tracking features coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}