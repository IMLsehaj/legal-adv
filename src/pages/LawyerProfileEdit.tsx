import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Validation Schema using Zod
const profileSchema = z.object({
  specialization: z.string().min(2, 'Specialization is required'),
  experience: z.coerce.number().min(0, 'Experience must be a valid number'),
  hourlyRate: z.coerce.number().min(0, 'Rate must be a valid number'),
  bio: z.string().min(10, 'Bio should be at least 10 characters long'),
  location: z.string().min(2, 'Location is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function LawyerProfileEdit() {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      specialization: '',
      experience: 0,
      hourlyRate: 0,
      bio: '',
      location: ''
    }
  });

  // Optional: Fetch the current user's profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Pre-fill the form if they already have details saved
          if (data.lawyerDetails) {
            reset(data.lawyerDetails);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      toast({ title: "Success", description: "Profile updated successfully!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Update Failed", description: "Failed to update profile. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl">
          <div className="glass-card rounded-xl p-6 md:p-8">
            <div className="mb-8">
              <h1 className="font-serif text-3xl text-foreground mb-2">Edit Expert Profile</h1>
              <p className="text-sm text-muted-foreground">Update your details to attract more clients on the Experts page.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label>Specialization</Label>
                  <Input 
                    {...register('specialization')} 
                    placeholder="e.g. Corporate Law, Family Law"
                  />
                  {errors.specialization && <p className="text-sm text-destructive">{errors.specialization.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Years of Experience</Label>
                  <Input 
                    type="number" 
                    {...register('experience')} 
                  />
                  {errors.experience && <p className="text-sm text-destructive">{errors.experience.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Hourly Rate (₹)</Label>
                  <Input 
                    type="number" 
                    {...register('hourlyRate')} 
                  />
                  {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input 
                    {...register('location')} 
                    placeholder="e.g. New Delhi, India"
                  />
                  {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Professional Bio</Label>
                <Textarea 
                  {...register('bio')} 
                  rows={4}
                  placeholder="Briefly describe your expertise, past cases, and how you can help clients..."
                />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}