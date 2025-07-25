'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type DeleteRoadmapButtonProps = {
  roadmapId: string;
};

export default function DeleteRoadmapButton({ roadmapId }: DeleteRoadmapButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const response = await fetch(`/api/roadmaps/${roadmapId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast.success('Roadmap deleted successfully.');
      // Refresh the page to update the list
      router.refresh();
    } else {
      toast.error('Failed to delete roadmap.');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-400 disabled:opacity-50"
      aria-label="Delete roadmap"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
}