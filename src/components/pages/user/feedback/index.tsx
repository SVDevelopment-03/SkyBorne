"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 
import { Badge } from '@/components/ui/badge'; 
import { 
  MessageSquare,
  Star,
  ThumbsUp,
  Send,
  CheckCircle,
  Clock,
  Calendar
} from 'lucide-react';

export default function UserFeedback() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const pastFeedback = [
    {
      id: 1,
      session: 'Vinyasa Flow Yoga',
      trainer: 'Priya Sharma',
      date: 'Dec 10, 2025',
      rating: 5,
      comment: 'Absolutely loved this session! The flow was perfect and Priya\'s guidance was excellent.',
      status: 'submitted',
      trainerResponse: 'Thank you so much for your kind words! Looking forward to seeing you in the next session.'
    },
    {
      id: 2,
      session: 'Mindful Meditation',
      trainer: 'Emily Johnson',
      date: 'Dec 8, 2025',
      rating: 4,
      comment: 'Great session, very calming. Would love more breathing exercises.',
      status: 'submitted',
      trainerResponse: null
    },
    {
      id: 3,
      session: 'Power Yoga',
      trainer: 'Michael Chen',
      date: 'Dec 5, 2025',
      rating: 5,
      comment: 'Challenging but rewarding! Michael pushes you to your best.',
      status: 'submitted',
      trainerResponse: 'Thanks for the feedback! Keep up the great work!'
    }
  ];

  const pendingFeedback = [
    {
      id: 1,
      session: 'Breath Work Session',
      trainer: 'Sarah Martinez',
      date: 'Dec 12, 2025',
      time: '5:30 PM'
    },
    {
      id: 2,
      session: 'Yin Yoga',
      trainer: 'Lisa Anderson',
      date: 'Dec 11, 2025',
      time: '6:30 PM'
    }
  ];

  const handleSubmitFeedback = () => {
    // Handle feedback submission
    console.log('Submitting feedback:', { rating, feedbackText });
    setRating(0);
    setFeedbackText('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#1A1A1A] mb-2">Feedback</h1>
        <p className="text-[#6B6B6B]">Share your experience and help us improve</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#e5e5e5]" style={{ borderRadius: '20px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1">Total Reviews</p>
                <p className="text-3xl text-[#1A1A1A]">{pastFeedback.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e5e5]" style={{ borderRadius: '20px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl">
                    {(pastFeedback.reduce((sum, f) => sum + f.rating, 0) / pastFeedback.length).toFixed(1)}
                  </p>
                  <Star className="w-6 h-6 text-[#f4b942] fill-current" />
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e5e5]" style={{ borderRadius: '20px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1">Pending</p>
                <p className="text-3xl">{pendingFeedback.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit New Feedback */}
      <Card className="border-[#e5e5e5]" style={{ borderRadius: '24px' }}>
        <CardHeader>
          <CardTitle className="text-xl text-[#1A1A1A]">Share Your Experience</CardTitle>
          <p className="text-sm text-[#6B6B6B] mt-1">Your feedback helps us improve our services</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating */}
          <div>
            <label className="text-sm text-[#6B6B6B] mb-3 block">How would you rate your experience?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'text-[#f4b942] fill-current'
                        : 'text-[#e5e5e5]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="text-sm text-[#6B6B6B] mb-2 block">Tell us more about your experience</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your thoughts, suggestions, or any concerns..."
              rows={5}
              className="w-full px-4 py-3 border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#b95e82] focus:ring-2 focus:ring-[#b95e82]/20 resize-none"
            />
            <p className="text-xs text-[#6B6B6B] mt-2">
              {feedbackText.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmitFeedback}
            disabled={rating === 0 || feedbackText.trim().length === 0}
            variant={"theme"}
            className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{ borderRadius: '12px' }}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>

      {/* Past Feedback */}
      <Card className="border-[#e5e5e5]" style={{ borderRadius: '24px' }}>
        <CardHeader>
          <CardTitle className="text-xl text-[#1A1A1A]">Your Feedback History</CardTitle>
          <p className="text-sm text-[#6B6B6B] mt-1">Review your past session feedback</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {pastFeedback.map((feedback) => (
            <div 
              key={feedback.id}
              className="p-6 bg-gradient-to-r from-[#fef9f5] to-white rounded-2xl border border-[#e5e5e5]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg text-[#1A1A1A] mb-1">{feedback.session}</h4>
                  <p className="text-sm text-[#6B6B6B] mb-2">with {feedback.trainer}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-5 h-5 ${
                          star <= feedback.rating
                            ? 'text-[#f4b942] fill-current'
                            : 'text-[#e5e5e5]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    className="bg-[#27AE60]/10 text-[#27AE60] mb-2 py-1!"
                    style={{ borderRadius: '8px' }}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Submitted
                  </Badge>
                  <p className="text-sm text-[#6B6B6B]">{feedback.date}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[#1A1A1A] leading-relaxed">{feedback.comment}</p>
              </div>

             
            </div>
          ))}
        </CardContent>
      </Card>


    </div>
  );
}
