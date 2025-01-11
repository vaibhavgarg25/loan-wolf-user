"use client";

import { supabase } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aadharCard, setAadharCard] = useState<File | null>(null);
  const [studentId, setStudentId] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  

  const validateStep1 = () => {
    if (!firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!age || parseInt(age) < 18) {
      setError("You must be at least 18 years old");
      return false;
    }
    if (!occupation.trim()) {
      setError("Occupation is required");
      return false;
    }
    if (!country.trim() || !state.trim() || !city.trim()) {
      setError("Location details are required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Valid email is required");
      return false;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");  // Clear any existing errors
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // 1. First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Then insert the additional user data
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              first_name: firstName,
              last_name: lastName,
              age: parseInt(age),
              occupation,
              country,
              state,
              city,
              username,
              email,
            }
          ]);

        if (profileError) throw profileError;

        // 3. Handle file uploads if needed
        if (aadharCard) {
          const { error: aadharError } = await supabase.storage
            .from('documents')
            .upload(`${authData.user.id}/aadhar`, aadharCard);
          if (aadharError) throw aadharError;
        }

        // Optional document uploads
        if (studentId) {
          await supabase.storage
            .from('documents')
            .upload(`${authData.user.id}/student`, studentId);
        }

        if (panCard) {
          await supabase.storage
            .from('documents')
            .upload(`${authData.user.id}/pan`, panCard);
        }

        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="min-h-screen flex my-10 items-center justify-center">
      <div className="relative w-full max-w-xl p-8 space-y-6 bg-card rounded-lg shadow-lg border">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl rounded-lg"></div>
      <motion.div
        initial={{ opacity: 0, scale: .95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: .3 }}
        className="relative"
      >
        <div className="relative space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Lender</h1>
          <p className="text-muted-foreground">
            Enter your credentials to create an account
          </p>
          <br/>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className='relative'
                  >
                    <Input 
                      id="firstName" 
                      type="text" 
                      placeholder="Enter First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-transparent border border-gray-300"
                      required
                    />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className='relative'
                  >
                    <Input 
                      id="lastName" 
                      type="text" 
                      placeholder="Enter Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-transparent border border-gray-300"
                      required
                    />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className='relative'
                  >
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="Enter Age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="bg-transparent border border-gray-300"
                      required
                    />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className='relative'
                  >
                    <Input 
                      id="occupation" 
                      type="text" 
                      placeholder="Enter Occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="bg-transparent border border-gray-300"
                      required
                    />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className='relative'
                  >
                    <Input 
                      id="country" 
                      type="text" 
                      placeholder="Enter Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="bg-transparent border border-gray-300"
                      required
                    />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className='relative'
                  >
                    <Input 
                      id="state" 
                      type="text" 
                      placeholder="Enter State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="bg-transparent border border-gray-300"
                      required
                    />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className='relative'
                  >
                    <Input 
                      id="city" 
                      type="text" 
                      placeholder="Enter City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-transparent border border-gray-300"
                      required
                    />
                  </motion.div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullAddress">Full Address</Label>
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className='relative'
                >
                  <Input 
                    id="fullAddress" 
                    type="text" 
                    placeholder="Enter Full Address"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="bg-transparent border border-gray-300 h-24"
                    required
                  />
                </motion.div>
              </div>
              <Button type="button" className="w-full my-1" size="lg" onClick={handleNext}>
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <motion.div
              whileHover={{ scale: 1.15 }}
              className='relative'
            >
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Choose Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent border border-gray-300"
                  required
                />
                </motion.div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <motion.div
              whileHover={{ scale: 1.15 }}
              className='relative'
            >
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border border-gray-300"
                  required
                />
                </motion.div>
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <motion.div
              whileHover={{ scale: 1.15 }}
              className='relative'
            >
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border border-gray-300"
                  required
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
                </motion.div>
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <motion.div
              whileHover={{ scale: 1.15 }}
              className='relative'
            >
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent border border-gray-300"
                  required
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
                </motion.div>
              </div>
              <div className="flex justify-between">
                <Button type="button" className="w-1/2 mr-2" onClick={handleBack}>
                  Back
                </Button>
                <Button type="button" className="w-1/2 ml-2" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="aadharCard">Aadhar Card (Required)</Label>
                <motion.div
              whileHover={{ scale: 1.15 }}
              className='relative'
            >
                <Input 
                  id="aadharCard" 
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setAadharCard(e.target.files ? e.target.files[0] : null)}
                  className="bg-transparent border border-gray-300"
                  required
                />
                </motion.div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID (Optional)</Label>
                <motion.div
              whileHover={{ scale: 1.15 }}
              className='relative'
            >
                <Input 
                  id="studentId" 
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setStudentId(e.target.files ? e.target.files[0] : null)}
                  className="bg-transparent border border-gray-300"
                />
                </motion.div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="panCard">PAN Card (Optional)</Label>
                <motion.div
              whileHover={{ scale: 1.15 }}
              className='relative'
            >
                <Input 
                  id="panCard" 
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setPanCard(e.target.files ? e.target.files[0] : null)}
                  className="bg-transparent border border-gray-300"
                />
                </motion.div>
              </div>
              <div className="flex justify-between">
                <Button type="button" className="w-1/2 mr-2" onClick={handleBack}>
                  Back
                </Button>
                <Button type="submit" className="w-1/2 ml-2">
                  Submit
                </Button>
              </div>
            </>
          )}
        </form>

        <div className="text-center text-sm">
          <Link
            href="/forgot-password"
            className=" my-2 text-primary hover:underline"
          >
            <br />
            Forgot your password?
            <br/>
          </Link>
        </div>
        <p className="text-center text-sm">
          OR Have an account?{" "}
          <Link href="/login" className="my-1 text-primary hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
      </div>
    </div>
  );
}