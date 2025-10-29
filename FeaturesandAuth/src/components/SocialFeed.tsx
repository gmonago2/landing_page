import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Heart, Send, TrendingUp, Award, Sparkles, Calendar, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Post {
  id: string;
  user_id: string;
  content: string;
  post_type: 'milestone' | 'story' | 'question' | 'celebration';
  created_at: string;
  user_email?: string;
  comment_count?: number;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_email?: string;
}

const POST_TYPES = [
  { value: 'milestone', label: 'Milestone', icon: Award, color: 'brand-yellow' },
  { value: 'story', label: 'Story', icon: MessageCircle, color: 'brand-blue' },
  { value: 'celebration', label: 'Celebration', icon: Sparkles, color: 'brand-green' },
  { value: 'question', label: 'Question', icon: MessageCircle, color: 'brand-blue' }
];

export function SocialFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', post_type: 'story' as Post['post_type'] });
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      const postsWithUsers = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: userData } = await supabase.auth.admin.getUserById(post.user_id);

          const { data: commentsData } = await supabase
            .from('comments')
            .select('id')
            .eq('post_id', post.id);

          return {
            ...post,
            user_email: userData?.user?.email || 'Anonymous',
            comment_count: commentsData?.length || 0
          };
        })
      );

      setPosts(postsWithUsers);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentsWithUsers = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: userData } = await supabase.auth.admin.getUserById(comment.user_id);
          return {
            ...comment,
            user_email: userData?.user?.email || 'Anonymous'
          };
        })
      );

      setComments(prev => ({ ...prev, [postId]: commentsWithUsers }));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const createPost = async () => {
    if (!newPost.content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user!.id,
          content: newPost.content,
          post_type: newPost.post_type
        });

      if (error) throw error;

      setNewPost({ content: '', post_type: 'story' });
      setShowCreatePost(false);
      await loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const createComment = async (postId: string) => {
    const content = newComment[postId]?.trim();
    if (!content || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user!.id,
          content
        });

      if (error) throw error;

      setNewComment(prev => ({ ...prev, [postId]: '' }));
      await loadComments(postId);
      await loadPosts();
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      if (!comments[postId]) {
        loadComments(postId);
      }
    }
    setExpandedPosts(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPostTypeInfo = (type: Post['post_type']) => {
    return POST_TYPES.find(t => t.value === type) || POST_TYPES[1];
  };

  const getUserDisplayName = (email: string) => {
    return email.split('@')[0];
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading community feed...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 rounded-2xl mb-4">
          <Users className="w-8 h-8 text-brand-blue" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Community Feed</h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Share your investing journey, celebrate milestones, and connect with other beginner investors learning together.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {!showCreatePost ? (
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
          >
            <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-blue" />
            </div>
            <span className="text-gray-600">Share your progress with the community...</span>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Create Post</h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2">
              {POST_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setNewPost({ ...newPost, post_type: type.value as Post['post_type'] })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                      newPost.post_type === type.value
                        ? `border-${type.color} bg-${type.color}/5`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>

            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="What's on your mind? Share a milestone, ask a question, or tell your story..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none resize-none"
              rows={4}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-6 py-2 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPost}
                disabled={!newPost.content.trim() || submitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">Be the first to share your investing journey!</p>
          <button
            onClick={() => setShowCreatePost(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-medium hover:bg-brand-blue/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const typeInfo = getPostTypeInfo(post.post_type);
            const Icon = typeInfo.icon;
            const isExpanded = expandedPosts.has(post.id);

            return (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-blue font-bold text-lg">
                        {getUserDisplayName(post.user_email || 'A').charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{getUserDisplayName(post.user_email || 'Anonymous')}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 bg-${typeInfo.color}/10 rounded-full`}>
                          <Icon className={`w-3 h-3 text-${typeInfo.color}`} />
                          <span className={`text-xs font-medium text-${typeInfo.color}`}>{typeInfo.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-brand-blue transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {post.comment_count || 0} {post.comment_count === 1 ? 'Comment' : 'Comments'}
                      </span>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-gray-50 border-t border-gray-100 p-6">
                    <div className="space-y-4">
                      {comments[post.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-brand-green/20 to-brand-blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-brand-blue font-bold text-sm">
                              {getUserDisplayName(comment.user_email || 'A').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900 text-sm">
                                {getUserDisplayName(comment.user_email || 'Anonymous')}
                              </span>
                              <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}

                      {(!comments[post.id] || comments[post.id].length === 0) && (
                        <p className="text-center text-gray-500 text-sm py-4">No comments yet. Be the first to comment!</p>
                      )}

                      <div className="flex gap-3 pt-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-brand-blue font-bold text-sm">
                            {getUserDisplayName(user?.email || 'A').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-brand-blue focus:outline-none"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                createComment(post.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => createComment(post.id)}
                            disabled={!newComment[post.id]?.trim() || submitting}
                            className="px-4 py-2 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
