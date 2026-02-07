"use client"

import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ME_QUERY, MeResponse } from '../../graphql/queries/user'
import {
  User,
  Mail,
  Shield,
  CheckCircle,
  Edit3,
  Settings,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Users,
  Terminal,
  Camera,
  Clock,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeSwitcher } from '@/components/theme-switcher'

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const { data, loading, error } = useQuery<MeResponse>(ME_QUERY, {
    errorPolicy: 'all'
  })

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Profile</h3>
            <p className="text-muted-foreground text-center mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data?.me?.data) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Profile Data</h3>
            <p className="text-muted-foreground text-center">Unable to load user profile information.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = data.me.data

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SYSADMIN': return 'destructive'
      case 'ADMIN': return 'default'
      case 'MODERATOR': return 'secondary'
      case 'USER': return 'outline'
      default: return 'outline'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SYSADMIN': return <Shield className="w-4 h-4" />
      case 'ADMIN': return <ShieldCheck className="w-4 h-4" />
      case 'MODERATOR': return <Users className="w-4 h-4" />
      case 'USER': return <User className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    if (user.userName) {
      return user.userName.substring(0, 2).toUpperCase()
    }
    return user.email.substring(0, 2).toUpperCase()
  }

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.userName) {
      return user.userName
    }
    return user.email.split('@')[0]
  }

  // Calculate account age in days
  const accountAge = user.createdAt ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 3600 * 24)) : 0

  // Mock stats - in a real app, these would come from additional queries
  const stats = {
    totalApiRequests: 1247,
    activeSessions: 3,
    lastActivity: user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Profile Avatar & Basic Info */}
                <div className="flex flex-col sm:flex-row gap-6 items-start flex-1">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                      <AvatarImage src={user.profileImageUrl} alt={getDisplayName()} />
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Button

                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{getDisplayName()}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getRoleColor(user.role)} className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                      {user.isVerified && (
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {accountAge} days active
                      </Badge>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button className="h-9">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="h-9">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="w-full lg:w-80">
                  <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Account Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <div className="text-2xl font-bold text-foreground">{stats.activeSessions}</div>
                          <div className="text-xs text-muted-foreground">Active Sessions</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <div className="text-2xl font-bold text-foreground">{accountAge}</div>
                          <div className="text-xs text-muted-foreground">Days Active</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={user.isActive ? 'text-green-700' : 'text-red-700'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Last Login</span>
                          <span className="text-foreground">
                            {user.lastLogin ? formatDateTime(user.lastLogin).split(',')[0] : 'Never'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Personal Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">First Name</label>
                          <p className="text-sm text-foreground font-medium">{user.firstName || 'Not provided'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                          <p className="text-sm text-foreground font-medium">{user.lastName || 'Not provided'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Username</label>
                          <p className="text-sm text-foreground font-medium">{user.userName || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                          <p className="text-sm text-foreground font-medium break-all">{user.email}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                          <p className="text-sm text-foreground font-medium">{user.phoneNumber || 'Not provided'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                          <p className="text-sm text-foreground font-medium">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">Account Created</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(user.createdAt)}</p>
                        </div>
                      </div>

                      {user.lastLogin && (
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">Last Login</p>
                            <p className="text-xs text-muted-foreground">{formatDateTime(user.lastLogin)}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">Profile Updated</p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">Password Changed</p>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Actions & Security */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 hover:bg-muted/50">
                        <Camera className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-medium">Change Photo</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 hover:bg-muted/50">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-medium">Security</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 hover:bg-muted/50">
                        <Terminal className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-medium">Sessions</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 hover:bg-muted/50">
                        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-medium">More</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Security */}
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ShieldCheck className="h-5 w-5" />
                      Security Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Email Verified</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Two-Factor Auth</span>
                      </div>
                      <Badge variant="outline">Disabled</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Active Sessions</span>
                      </div>
                      <Badge variant="outline">{stats.activeSessions}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Support Card */}
                <Card className="border-border/50 shadow-sm bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our support team is here to help you with any questions.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" className="w-full">
                        Contact Support
                      </Button>
                      <Button variant="ghost" className="w-full text-muted-foreground">
                        View Help Center
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Application Settings</h2>
                <p className="text-muted-foreground">
                  Manage your application preferences and appearance settings.
                </p>
              </div>

              <ThemeSwitcher />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Loading Skeleton Component
const ProfileSkeleton = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Hero Section Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Information Sections Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
