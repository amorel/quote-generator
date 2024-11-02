/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { UserProfile as IUserProfile } from "@quote-generator/shared";
import { Quote } from "@quote-generator/shared";
import { UserService } from "../../services/UserService";

interface ProfileProps {
  userId: string;
}

// Composants
const UserInfo = ({
  profile,
  onUpdate,
}: {
  profile: IUserProfile;
  onUpdate: (data: Partial<IUserProfile>) => void;
}) => (
  <div>
    <h2>Profile Information</h2>
    {/* Formulaire de profil */}
  </div>
);

const FavoriteQuotes = ({ quotes }: { quotes: Quote[] }) => (
  <div>
    <h2>Favorite Quotes</h2>
    {quotes.map((quote) => (
      <blockquote key={quote.id}>{quote.content}</blockquote>
    ))}
  </div>
);

const ReadingPreferences = ({
  preferences,
  onUpdate,
}: {
  preferences: IUserProfile["profile"]["preferences"];
  onUpdate: (
    preferences: Partial<IUserProfile["profile"]["preferences"]>
  ) => void;
}) => (
  <div>
    <h2>Reading Preferences</h2>
    {/* Formulaire de préférences */}
  </div>
);

export const UserProfile = ({ userId }: ProfileProps) => {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const userService = new UserService();

  useEffect(() => {
    const loadUserData = async () => {
      const userProfile = await userService.getProfile(userId);
      const userFavorites = await userService.getFavorites(userId);
      setProfile(userProfile);
      setFavorites(userFavorites);
    };
    loadUserData();
  }, [userId]);

  const handleProfileUpdate = async (data: Partial<IUserProfile>) => {
    if (!profile) return;
    const updated = await userService.updateProfile(userId, data);
    setProfile(updated);
  };

  const handlePreferencesUpdate = async (
    preferences: Partial<IUserProfile["profile"]["preferences"]>
  ) => {
    if (!profile) return;
    const updated = await userService.updatePreferences(userId, preferences);
    setProfile(updated);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <UserInfo profile={profile} onUpdate={handleProfileUpdate} />
      <FavoriteQuotes quotes={favorites} />
      <ReadingPreferences
        preferences={profile.profile.preferences}
        onUpdate={handlePreferencesUpdate}
      />
    </div>
  );
};
