'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';

// Define the types for our data
type Topic = {
  title: string;
  description: string;
};

type Section = {
  title: string;
  topics: Topic[];
};

type Roadmap = {
  id: string;
  title: string;
  description: string;
  content: { sections: Section[] };
};

type UserProgress = {
  topic_title: string;
};

type RoadmapClientPageProps = {
  roadmap: Roadmap;
  initialProgress: UserProgress[];
};

export default function RoadmapClientPage({ roadmap, initialProgress }: RoadmapClientPageProps) {
  // Use a Set for efficient lookups of completed topics
  const [completedTopics, setCompletedTopics] = useState(
    new Set(initialProgress.map((p) => p.topic_title))
  );

  const handleCheckboxChange = async (topicTitle: string, isCompleted: boolean) => {
    // Optimistic UI update: update the UI immediately
    const newCompletedTopics = new Set(completedTopics);
    if (isCompleted) {
      newCompletedTopics.add(topicTitle);
    } else {
      newCompletedTopics.delete(topicTitle);
    }
    setCompletedTopics(newCompletedTopics);

    // Call the API to save the change
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmap_id: roadmap.id,
          topic_title: topicTitle,
          is_completed: isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress.');
      }
    } catch (error) {
      toast.error('Could not save progress. Please try again.');
      // Revert UI on error
      const revertedTopics = new Set(completedTopics);
      if (isCompleted) {
        revertedTopics.delete(topicTitle);
      } else {
        revertedTopics.add(topicTitle);
      }
      setCompletedTopics(revertedTopics);
    }
  };

  return (
    <div className="mt-12 space-y-12">
      {roadmap.content?.sections?.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h2 className="mb-6 text-2xl font-bold text-purple-400">{section.title}</h2>
          <div className="space-y-4">
            {section.topics.map((topic, topicIndex) => {
              const isCompleted = completedTopics.has(topic.title);
              return (
                <label
                  key={topicIndex}
                  className="flex items-start gap-4 rounded-lg border border-gray-700 bg-gray-800 p-4 cursor-pointer transition-colors hover:bg-gray-700 has-[:checked]:bg-green-900/50 has-[:checked]:border-green-700"
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isCompleted}
                    onChange={(e) => handleCheckboxChange(topic.title, e.target.checked)}
                  />
                  <div className="mt-1 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                    <p className="mt-1 text-gray-400">{topic.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}