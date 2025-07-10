import React, { useState, useRef } from 'react';
import { Camera, Upload, User, Sparkles, Check, X, Palette, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AvatarUploadProps {
  onAvatarChange?: (avatarUrl: string) => void;
}

export default function AvatarUpload({ onAvatarChange }: AvatarUploadProps) {
  const { user, updateAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('avataaars');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Beautiful animated avatar categories
  const avatarCategories = {
    avataaars: {
      name: 'Avataaars',
      icon: '👤',
      description: 'Colorful cartoon-style avatars',
      avatars: [
        {
          url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4&clothesColor=262e33&eyeType=happy&mouthType=smile',
          name: 'Happy Felix'
        },
        {
          url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffd93d&clothesColor=3c4043&eyeType=wink&mouthType=twinkle',
          name: 'Winking Aneka'
        },
        {
          url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Garland&backgroundColor=ffdfbf&clothesColor=65c9ff&eyeType=hearts&mouthType=smile',
          name: 'Lovely Garland'
        },
        {
          url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight&backgroundColor=c0aede&clothesColor=ff488e&eyeType=surprised&mouthType=eating',
          name: 'Surprised Midnight'
        },
        {
          url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper&backgroundColor=d1d4f9&clothesColor=25c2a0&eyeType=default&mouthType=default',
          name: 'Cool Jasper'
        },
        {
          url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar&backgroundColor=fecaca&clothesColor=6366f1&eyeType=squint&mouthType=tongue',
          name: 'Playful Oscar'
        },
        {
          url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=a7f3d0&clothesColor=f59e0b&eyeType=default&mouthType=smile',
          name: 'Cheerful Luna'
        },
        {
          url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova&backgroundColor=fbbf24&clothesColor=8b5cf6&eyeType=happy&mouthType=default',
          name: 'Bright Nova'
        }
      ]
    },
    adventurer: {
      name: 'Adventurer',
      icon: '🎭',
      description: 'Adventure-themed characters',
      avatars: [
        {
          url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Boots&backgroundColor=b6e3f4&skinColor=f2d3b1',
          name: 'Explorer Boots'
        },
        {
          url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Annie&backgroundColor=ffd93d&skinColor=edb98a',
          name: 'Brave Annie'
        },
        {
          url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=ffdfbf&skinColor=fd9841',
          name: 'Daring Felix'
        },
        {
          url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Snickers&backgroundColor=c0aede&skinColor=f2d3b1',
          name: 'Bold Snickers'
        },
        {
          url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Peanut&backgroundColor=d1d4f9&skinColor=edb98a',
          name: 'Fearless Peanut'
        },
        {
          url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Cuddles&backgroundColor=fecaca&skinColor=fd9841',
          name: 'Mighty Cuddles'
        },
        {
          url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Buster&backgroundColor=a7f3d0&skinColor=f2d3b1',
          name: 'Swift Buster'
        },
        {
          url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo&backgroundColor=fbbf24&skinColor=edb98a',
          name: 'Clever Milo'
        }
      ]
    },
    bigSmile: {
      name: 'Big Smile',
      icon: '😊',
      description: 'Always happy and smiling',
      avatars: [
        {
          url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Happy&backgroundColor=b6e3f4',
          name: 'Joyful Happy'
        },
        {
          url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Sunshine&backgroundColor=ffd93d',
          name: 'Bright Sunshine'
        },
        {
          url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Cheerful&backgroundColor=ffdfbf',
          name: 'Merry Cheerful'
        },
        {
          url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Giggles&backgroundColor=c0aede',
          name: 'Bubbly Giggles'
        },
        {
          url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Sparkle&backgroundColor=d1d4f9',
          name: 'Radiant Sparkle'
        },
        {
          url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Bliss&backgroundColor=fecaca',
          name: 'Peaceful Bliss'
        },
        {
          url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Delight&backgroundColor=a7f3d0',
          name: 'Pure Delight'
        },
        {
          url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Glow&backgroundColor=fbbf24',
          name: 'Golden Glow'
        }
      ]
    },
    personas: {
      name: 'Personas',
      icon: '🎨',
      description: 'Artistic and creative characters',
      avatars: [
        {
          url: 'https://api.dicebear.com/7.x/personas/svg?seed=Artist&backgroundColor=b6e3f4',
          name: 'Creative Artist'
        },
        {
          url: 'https://api.dicebear.com/7.x/personas/svg?seed=Designer&backgroundColor=ffd93d',
          name: 'Stylish Designer'
        },
        {
          url: 'https://api.dicebear.com/7.x/personas/svg?seed=Painter&backgroundColor=ffdfbf',
          name: 'Vibrant Painter'
        },
        {
          url: 'https://api.dicebear.com/7.x/personas/svg?seed=Sculptor&backgroundColor=c0aede',
          name: 'Elegant Sculptor'
        },
        {
          url: 'https://api.dicebear.com/7.x/personas/svg?seed=Musician&backgroundColor=d1d4f9',
          name: 'Melodic Musician'
        },
        {
          url: 'https://api.dicebear.com/7.x/personas/svg?seed=Writer&backgroundColor=fecaca',
          name: 'Thoughtful Writer'
        },
        {
          url: 'https://api.dicebear.com/7.x/personas/svg?seed=Dreamer&backgroundColor=a7f3d0',
          name: 'Inspiring Dreamer'
        },
        {
          url: 'https://api.dicebear.com/7.x/personas/svg?seed=Visionary&backgroundColor=fbbf24',
          name: 'Bold Visionary'
        }
      ]
    },
    funEmoji: {
      name: 'Fun Emoji',
      icon: '🎉',
      description: 'Playful emoji-style avatars',
      avatars: [
        {
          url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Party&backgroundColor=b6e3f4',
          name: 'Party Time'
        },
        {
          url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Celebration&backgroundColor=ffd93d',
          name: 'Celebration Mode'
        },
        {
          url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Joy&backgroundColor=ffdfbf',
          name: 'Pure Joy'
        },
        {
          url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Excitement&backgroundColor=c0aede',
          name: 'Full Excitement'
        },
        {
          url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Energy&backgroundColor=d1d4f9',
          name: 'High Energy'
        },
        {
          url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Vibes&backgroundColor=fecaca',
          name: 'Good Vibes'
        },
        {
          url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Spirit&backgroundColor=a7f3d0',
          name: 'Free Spirit'
        },
        {
          url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Magic&backgroundColor=fbbf24',
          name: 'Pure Magic'
        }
      ]
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        setSelectedAvatar(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    setIsUploading(true);
    try {
      // Update avatar using the auth context
      await updateAvatar(avatarUrl);
      
      if (onAvatarChange) {
        onAvatarChange(avatarUrl);
      }

      setPreviewUrl(null);
      setSelectedAvatar(null);
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to update avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCustomUpload = async () => {
    if (!previewUrl) return;
    await handleAvatarSelect(previewUrl);
  };

  const currentAvatar = previewUrl || selectedAvatar || user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;
  const currentCategory = avatarCategories[selectedCategory as keyof typeof avatarCategories];

  return (
    <div className="space-y-8">
      {/* Current Avatar Preview */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-1">
            <img
              src={currentAvatar}
              alt="Avatar preview"
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>
          
          {/* Floating camera button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
            disabled={isUploading}
          >
            <Camera className="w-5 h-5" />
          </button>
          
          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span>Choose Your Avatar</span>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select from our beautiful animated collection
          </p>
        </div>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Custom Upload Preview */}
      {previewUrl && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  Custom Upload Ready
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Your photo looks amazing!</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setPreviewUrl(null)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleCustomUpload}
                disabled={isUploading}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Check className="w-4 h-4" />
                <span>{isUploading ? 'Applying...' : 'Use This Photo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Categories */}
      <div>
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-purple-500" />
          Avatar Categories
        </h5>
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(avatarCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === key
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            <strong>{currentCategory.name}:</strong> {currentCategory.description}
          </p>
        </div>
      </div>

      {/* Avatar Gallery */}
      <div className="grid grid-cols-4 gap-4">
        {currentCategory.avatars.map((avatar, index) => (
          <div key={index} className="relative group">
            <button
              onClick={() => {
                setSelectedAvatar(avatar.url);
                setPreviewUrl(null);
              }}
              disabled={isUploading}
              className={`relative w-full aspect-square rounded-2xl overflow-hidden border-3 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                selectedAvatar === avatar.url
                  ? 'border-purple-500 ring-4 ring-purple-200 dark:ring-purple-800'
                  : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              <img
                src={avatar.url}
                alt={avatar.name}
                className="w-full h-full object-cover bg-white"
              />
              
              {/* Selection overlay */}
              {selectedAvatar === avatar.url && (
                <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                  <div className="bg-purple-500 text-white p-2 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              {/* Loading overlay */}
              {isUploading && selectedAvatar === avatar.url && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    {avatar.name}
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Apply Selected Avatar Button */}
      {selectedAvatar && !previewUrl && (
        <div className="flex justify-center">
          <button
            onClick={() => handleAvatarSelect(selectedAvatar)}
            disabled={isUploading}
            className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Star className="w-5 h-5" />
            <span className="font-semibold">
              {isUploading ? 'Applying Avatar...' : 'Apply Selected Avatar'}
            </span>
          </button>
        </div>
      )}

      {/* Upload Custom Button */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-300 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex flex-col items-center space-y-3 w-full disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Upload Custom Photo</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              JPG, PNG, or GIF up to 5MB
            </p>
          </div>
        </button>
      </div>

      {/* Tips */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
        <div className="flex items-start space-x-3">
          <div className="bg-purple-500 rounded-full p-1 mt-0.5">
            <User className="w-3 h-3 text-white" />
          </div>
          <div>
            <h6 className="font-medium text-purple-900 dark:text-purple-100">Avatar Tips</h6>
            <ul className="text-sm text-purple-700 dark:text-purple-200 mt-1 space-y-1">
              <li>• All avatars are generated and animated</li>
              <li>• Each category has unique personality traits</li>
              <li>• Your avatar represents you across the platform</li>
              <li>• Custom uploads are also supported</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}