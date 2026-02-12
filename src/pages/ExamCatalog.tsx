
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Users, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllMindMaps } from '@/utils/mindmapStorage';
import { EXAM_CATEGORIES, ExamCategory } from '@/components/mindmap/types';

interface MindMapItem {
  name: string;
  examCategory?: ExamCategory;
  subExamName?: string;
  createdAt?: string;
}

const ExamCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mindMaps, setMindMaps] = useState<MindMapItem[]>([]);

  useEffect(() => {
    const loadMindMaps = () => {
      const savedMaps = getAllMindMaps();
      let allMindmaps: Record<string, any> = {};
      try {
        const raw = localStorage.getItem('mindmaps');
        if (raw) allMindmaps = JSON.parse(raw);
      } catch (error) {
        console.error('Error parsing mindmaps storage:', error);
      }
      const mapData: MindMapItem[] = savedMaps.map(name => {
        const entry = allMindmaps[name];
        if (entry) {
          return {
            name,
            examCategory: entry.examCategory,
            subExamName: entry.subExamName,
            createdAt: entry.createdAt || new Date().toISOString()
          };
        }
        return { name };
      });
      setMindMaps(mapData);
    };

    loadMindMaps();
  }, []);

  const filteredMaps = mindMaps.filter(map => {
    const matchesSearch = map.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         map.subExamName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || map.examCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category?: ExamCategory) => {
    switch (category) {
      case 'SSC EXAMS':
      case 'BANKING EXAMS':
      case 'CIVIL SERVICES EXAMS':
        return <Award className="h-4 w-4" />;
      case 'SCHOOL EXAMS':
      case 'TEACHING EXAMS':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exam Mind Maps</h1>
            <p className="text-gray-600 mt-2">Explore and manage your study materials</p>
          </div>
          <Link to="/">
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Create New Map
            </Button>
          </Link>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search mind maps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {EXAM_CATEGORIES.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaps.map((map) => (
            <Card key={map.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(map.examCategory)}
                    <CardTitle className="text-lg">{map.name}</CardTitle>
                  </div>
                  {map.examCategory && (
                    <Badge variant="secondary" className="text-xs">
                      {map.examCategory}
                    </Badge>
                  )}
                </div>
                {map.subExamName && (
                  <CardDescription>{map.subExamName}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>
                      {map.createdAt 
                        ? new Date(map.createdAt).toLocaleDateString()
                        : 'Unknown date'
                      }
                    </span>
                  </div>
                  <Link to={`/view?map=${encodeURIComponent(map.name)}`}>
                    <Button size="sm">View Map</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaps.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mind maps found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first mind map to get started'
              }
            </p>
            <Link to="/">
              <Button>Create New Mind Map</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamCatalog;
