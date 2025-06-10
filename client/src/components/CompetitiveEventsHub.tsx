import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Trophy, 
  BookOpen, 
  Target,
  Award,
  Star,
  ChevronRight,
  PlayCircle,
  FileText,
  Presentation,
  Users2,
  TestTube
} from 'lucide-react';
import { allCompetitionEvents, getEventsByOrganization, getEventsByCategory, searchEvents } from '@/data/completeCompetitionEvents';

interface EventCardProps {
  event: any;
  onSelectEvent: (event: any) => void;
}

const EventCard = ({ event, onSelectEvent }: EventCardProps) => {
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'role-play': return <Users2 className="w-4 h-4" />;
      case 'presentation': return <Presentation className="w-4 h-4" />;
      case 'written': return <FileText className="w-4 h-4" />;
      case 'case-study': return <BookOpen className="w-4 h-4" />;
      case 'objective-test': return <TestTube className="w-4 h-4" />;
      case 'performance': return <PlayCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getOrgColor = (org: string) => {
    switch (org) {
      case 'DECA': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FBLA': return 'bg-green-100 text-green-800 border-green-200';
      case 'HOSA': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{event.name}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getOrgColor(event.organization)}>
                {event.organization}
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                {getFormatIcon(event.format)}
                <span className="capitalize">{event.format.replace('-', ' ')}</span>
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectEvent(event)}
            className="text-blue-600 hover:text-blue-800"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{event.timeLimit}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{event.participants} participant{event.participants !== '1' ? 's' : ''}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Trophy className="w-3 h-3" />
            <span>{event.category}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {event.keySkills.slice(0, 3).map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {event.keySkills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{event.keySkills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EventDetailModal = ({ event, onClose, onStartPractice }: any) => {
  if (!event) return null;

  const totalRubricPoints = event.rubric.reduce((sum: number, criteria: any) => sum + criteria.maxPoints, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
              <div className="flex items-center space-x-3">
                <Badge className={`${
                  event.organization === 'DECA' ? 'bg-blue-100 text-blue-800' :
                  event.organization === 'FBLA' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.organization}
                </Badge>
                <Badge variant="outline">{event.category}</Badge>
                <Badge variant="outline" className="capitalize">{event.format.replace('-', ' ')}</Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => onStartPractice(event)} className="bg-green-600 hover:bg-green-700">
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Practice
              </Button>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Event Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time Limit:</span>
                  <span className="font-medium">{event.timeLimit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">{event.participants}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Judges:</span>
                  <span className="font-medium">{event.judgeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{event.competitionLevel}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{event.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Key Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Key Skills Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {event.keySkills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Official Rubric */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Official Judging Rubric ({totalRubricPoints} points total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.rubric.map((criteria: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{criteria.name}</h4>
                      <Badge variant="outline">{criteria.maxPoints} points</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{criteria.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {criteria.levels.map((level: any, levelIndex: number) => (
                        <div 
                          key={levelIndex}
                          className={`p-3 rounded border ${
                            level.level === 4 ? 'bg-green-50 border-green-200' :
                            level.level === 3 ? 'bg-blue-50 border-blue-200' :
                            level.level === 2 ? 'bg-yellow-50 border-yellow-200' :
                            'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">Level {level.level}</span>
                            <span className="text-sm font-semibold">{level.points} pts</span>
                          </div>
                          <p className="text-sm text-gray-700">{level.descriptor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preparation Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Official Preparation Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {event.preparationTips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function CompetitiveEventsHub() {
  const [selectedOrg, setSelectedOrg] = useState<'ALL' | 'DECA' | 'FBLA' | 'HOSA'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = useMemo(() => {
    let events = selectedOrg === 'ALL' ? allCompetitionEvents : getEventsByOrganization(selectedOrg);
    
    if (searchTerm) {
      events = searchEvents(searchTerm);
      if (selectedOrg !== 'ALL') {
        events = events.filter(event => event.organization === selectedOrg);
      }
    }
    
    if (selectedCategory !== 'ALL') {
      events = events.filter(event => event.category === selectedCategory);
    }
    
    return events;
  }, [selectedOrg, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const orgEvents = selectedOrg === 'ALL' ? allCompetitionEvents : getEventsByOrganization(selectedOrg);
    const allCategories = orgEvents.map(event => event.category);
    const uniqueCategories = allCategories.filter((category, index) => allCategories.indexOf(category) === index);
    return uniqueCategories.sort();
  }, [selectedOrg]);

  const eventCounts = {
    DECA: getEventsByOrganization('DECA').length,
    FBLA: getEventsByOrganization('FBLA').length,
    HOSA: getEventsByOrganization('HOSA').length
  };

  const handleStartPractice = (event: any) => {
    // This would integrate with the practice system
    console.log('Starting practice for:', event.name);
    setSelectedEvent(null);
    // Navigate to practice mode with event context
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Competitive Events Hub</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Practice with official DECA, FBLA, and HOSA competitive events. Each event includes authentic rubrics, 
          preparation guidelines, and AI-powered coaching based on official competition standards.
        </p>
      </div>

      {/* Organization Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{allCompetitionEvents.length}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{eventCounts.DECA}</div>
            <div className="text-sm text-gray-600">DECA Events</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{eventCounts.FBLA}</div>
            <div className="text-sm text-gray-600">FBLA Events</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{eventCounts.HOSA}</div>
            <div className="text-sm text-gray-600">HOSA Events</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Organization Tabs */}
            <Tabs value={selectedOrg} onValueChange={(value: any) => setSelectedOrg(value)} className="flex-1">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ALL">All Organizations</TabsTrigger>
                <TabsTrigger value="DECA">DECA ({eventCounts.DECA})</TabsTrigger>
                <TabsTrigger value="FBLA">FBLA ({eventCounts.FBLA})</TabsTrigger>
                <TabsTrigger value="HOSA">HOSA ({eventCounts.HOSA})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search events by name, description, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'ALL' && ` in ${selectedCategory}`}
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onSelectEvent={setSelectedEvent}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find the events you're looking for.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onStartPractice={handleStartPractice}
        />
      )}
    </div>
  );
}