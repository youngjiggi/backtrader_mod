import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, User } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string;
  displayName: string;
  onAvatarChange: (avatarUrl: string | undefined) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  displayName,
  onAvatarChange,
  size = 'medium',
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user initials for fallback
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Size configurations
  const sizeConfig = {
    small: { avatar: 'w-12 h-12', text: 'text-sm', icon: 16, button: 'p-1' },
    medium: { avatar: 'w-20 h-20', text: 'text-base', icon: 20, button: 'p-2' },
    large: { avatar: 'w-32 h-32', text: 'text-2xl', icon: 24, button: 'p-3' }
  };

  const config = sizeConfig[size];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowPreview(true);
  };

  const handleUpload = async () => {
    if (!previewUrl) return;

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would upload to a server and return the URL
      // For demo purposes, we'll use the preview URL
      onAvatarChange(previewUrl);
      setShowPreview(false);
      
      // Clean up the object URL to prevent memory leaks
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (error) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setShowPreview(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    onAvatarChange(undefined);
  };

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="relative inline-block">
      {/* Avatar Display */}
      <div className="relative">
        {currentAvatar ? (
          <img 
            src={currentAvatar} 
            alt={displayName}
            className={`${config.avatar} rounded-full object-cover border-2`}
            style={{ borderColor: 'var(--accent)' }}
          />
        ) : (
          <div 
            className={`${config.avatar} rounded-full flex items-center justify-center ${config.text} font-bold border-2`}
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)',
              borderColor: 'var(--accent)'
            }}
          >
            {getUserInitials(displayName)}
          </div>
        )}

        {/* Upload Button */}
        {!disabled && (
          <button
            onClick={openFileDialog}
            className={`absolute bottom-0 right-0 ${config.button} rounded-full border-2 transition-colors hover:bg-opacity-80`}
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
            title="Change avatar"
          >
            <Camera size={config.icon} />
          </button>
        )}

        {/* Remove Button (only if avatar exists) */}
        {currentAvatar && !disabled && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute top-0 right-0 p-1 rounded-full border transition-colors hover:bg-red-50"
            style={{
              backgroundColor: '#fee2e2',
              borderColor: '#fecaca',
              color: '#dc2626'
            }}
            title="Remove avatar"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20">
          <div 
            className="px-3 py-1 rounded text-sm whitespace-nowrap"
            style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
          >
            {error}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              Preview Avatar
            </h3>
            
            {/* Preview Image */}
            <div className="flex justify-center mb-4">
              <img 
                src={previewUrl || ''}
                alt="Avatar preview"
                className="w-32 h-32 rounded-full object-cover border-2"
                style={{ borderColor: 'var(--accent)' }}
              />
            </div>

            <p className="text-sm mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              This will be your new profile picture
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="flex-1 px-4 py-2 border rounded-lg transition-colors hover:bg-opacity-80 disabled:opacity-50"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;