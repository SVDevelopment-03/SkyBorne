/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useState, useEffect } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 
import { Badge } from '@/components/ui/badge'; 
import { Select } from '@/components/ui/Select2';
import { 
  MessageSquare,
  Star,
  ThumbsUp,
  Send,
  CheckCircle,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetActiveTrainersQuery } from '@/store/api/trainerApi';
import { useSubmitFeedbackMutation, useGetUserFeedbackQuery } from '@/store/api/feedbackApi';
import useGetUser from '@/hooks/useGetUser';

interface FormValues {
  trainerId: string;
  rating: number;
  comment: string;
}

const validationSchema = Yup.object().shape({
  trainerId: Yup.string().optional(),
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Please select a rating')
    .max(5, 'Rating must be between 1 and 5'),
  comment: Yup.string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment cannot exceed 500 characters'),
});

export default function UserFeedback() {
  const [trainerOptions, setTrainerOptions] = useState<
    { label: string; value: string }[] | null
  >(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  const { user } = useGetUser();

  // Fetch active trainers
  const { data: trainersData, isLoading: trainersLoading } = useGetActiveTrainersQuery({
    page: 1,
    limit: 100,
    search: "",
  });

  // Fetch user feedback
  const { data: feedbackData, isLoading: feedbackLoading, refetch } = useGetUserFeedbackQuery(
    user?.id || '',
    { skip: !user?.id }
  );

  // Submit feedback mutation
  const [submitFeedback, { isLoading: isSubmitting }] = useSubmitFeedbackMutation();

  // Build trainer options from API data
  useEffect(() => {
    if (!trainersLoading && Array.isArray(trainersData?.data)) {
      const formatted = trainersData?.data.map((item: any) => ({
        label: item?.name,
        value: item?._id,
      }));
      setTrainerOptions(formatted);
    }
  }, [trainersData?.data, trainersLoading]);

  const initialValues: FormValues = {
    trainerId: '',
    rating: 0,
    comment: '',
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      const payload = {
        trainerId: values.trainerId || null,
        rating: values.rating,
        comment: values.comment,
      };

      const response: any = await submitFeedback(payload);

      if (response?.data?.success) {
        toast.success('Feedback submitted successfully!');
        resetForm();
        refetch();
      } else {
        toast.error(response?.data?.message || 'Failed to submit feedback');
      }
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast.error(error.message || 'Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const pastFeedback = feedbackData?.data || [];
  const totalReviews = pastFeedback.length;
  const averageRating = totalReviews > 0
    ? (pastFeedback.reduce((sum: number, f: any) => sum + f.rating, 0) / totalReviews).toFixed(1)
    : 0;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#1A1A1A] mb-2">Feedback</h1>
        <p className="text-[#6B6B6B]">Share your experience and help us improve</p>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#e5e5e5]" style={{ borderRadius: '20px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1">Total Reviews</p>
                <p className="text-3xl text-[#1A1A1A]">{totalReviews}</p>
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
                  <p className="text-3xl">{averageRating}</p>
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
                <p className="text-sm text-[#6B6B6B] mb-1">Loading</p>
                <p className="text-3xl">{feedbackLoading ? '...' : '0'}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Submit New Feedback */}
      <Card className="border-[#e5e5e5]" style={{ borderRadius: '24px' }}>
        <CardHeader>
          <CardTitle className="text-xl text-[#1A1A1A]">Share Your Experience</CardTitle>
          <p className="text-sm text-[#6B6B6B] mt-1">Your feedback helps us improve our services</p>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Trainer Selection */}
                {/* {trainerOptions && (
                  <div>
                    <Select
                      label="Select Trainer (Optional)"
                      value={values.trainerId}
                      onChange={(val) => setFieldValue('trainerId', val)}
                      options={trainerOptions}
                      placeholder="Choose a trainer..."
                    />
                    {errors.trainerId && touched.trainerId && (
                      <p className="text-red-500 text-sm mt-1">{errors.trainerId}</p>
                    )}
                  </div>
                )} */}

                {/* Rating */}
                <div>
                  <label className="text-sm text-[#6B6B6B] mb-3 block">
                    How would you rate your experience?
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFieldValue('rating', star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= (hoveredRating || values.rating)
                              ? 'text-[#f4b942] fill-current'
                              : 'text-[#e5e5e5]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && touched.rating && (
                    <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                  )}
                </div>

                {/* Feedback Text */}
                <div>
                  <label className="text-sm text-[#6B6B6B] mb-2 block">
                    Tell us more about your experience
                  </label>
                  <textarea
                    name="comment"
                    value={values.comment}
                    onChange={(e) => setFieldValue('comment', e.target.value)}
                    onBlur={() => setFieldValue('comment', values.comment)}
                    placeholder="Share your thoughts, suggestions, or any concerns..."
                    rows={5}
                    className="w-full px-4 py-3 border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#b95e82] focus:ring-2 focus:ring-[#b95e82]/20 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-[#6B6B6B]">
                      {values.comment.length}/500 characters
                    </p>
                    {errors.comment && touched.comment && (
                      <p className="text-red-500 text-sm">{errors.comment}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || values.rating === 0 || values.comment.trim().length === 0}
                  variant="theme"
                  className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                  style={{ borderRadius: '12px' }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Past Feedback */}
      <Card className="border-[#e5e5e5]" style={{ borderRadius: '24px' }}>
        <CardHeader>
          <CardTitle className="text-xl text-[#1A1A1A]">Your Feedback History</CardTitle>
          <p className="text-sm text-[#6B6B6B] mt-1">Review your past session feedback</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedbackLoading ? (
            <p className="text-[#6B6B6B]">Loading feedback history...</p>
          ) : pastFeedback.length > 0 ? (
            pastFeedback.map((feedback: any) => (
              <div
                key={feedback._id}
                className="p-6 bg-gradient-to-r from-[#fef9f5] to-white rounded-2xl border border-[#e5e5e5]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-[#6B6B6B] mb-2">
                      {feedback.trainerName || 'General Feedback'}
                    </p>
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
                    <p className="text-sm text-[#494949] text-center w-full">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[#1A1A1A] leading-relaxed">{feedback.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#6B6B6B]">No feedback submitted yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}