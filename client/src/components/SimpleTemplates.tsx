import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Play } from 'lucide-react';

export default function SimpleTemplates() {
  const templates = [
    { id: 1, name: "Business Presentation", description: "Professional presentation structure", category: "Business" },
    { id: 2, name: "Job Interview", description: "Common interview questions and responses", category: "Career" },
    { id: 3, name: "Wedding Toast", description: "Heartfelt wedding speech template", category: "Personal" },
    { id: 4, name: "Sales Pitch", description: "Persuasive sales presentation", category: "Business" },
    { id: 5, name: "Conference Talk", description: "Technical conference presentation", category: "Professional" },
    { id: 6, name: "Team Meeting", description: "Effective team communication", category: "Leadership" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Speech Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2 inline-block">
                    {template.category}
                  </span>
                </div>
                <Button size="sm" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}