import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Music,
  Repeat,
  Shuffle
} from 'lucide-react';

export const MediaPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume] = useState(75);
  const [progress] = useState(35);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Highway Groove',
    artist: 'AsphaltOS Sounds',
    duration: '3:42',
    currentTime: '1:18'
  });

  const playlist = [
    { title: 'Highway Groove', artist: 'AsphaltOS Sounds' },
    { title: 'Paving Rhythm', artist: 'Construction Beats' },
    { title: 'Road Work Blues', artist: 'Heavy Machinery' },
    { title: 'Asphalt Dreams', artist: 'Infrastructure FM' }
  ];

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-3">
      {/* Current Track */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Music className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Now Playing</span>
        </div>
        <div className="text-xs font-medium">{currentTrack.title}</div>
        <div className="text-xs text-muted-foreground">{currentTrack.artist}</div>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <Progress value={progress} className="h-1" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentTrack.currentTime}</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Shuffle className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <SkipBack className="h-3 w-3" />
        </Button>
        <Button size="sm" onClick={togglePlayPause} className="h-8 w-8 p-0">
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <SkipForward className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Repeat className="h-3 w-3" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleMute}
          className="h-6 w-6 p-0"
        >
          {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
        </Button>
        <Progress value={isMuted ? 0 : volume} className="h-1 flex-1" />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {isMuted ? 0 : volume}%
        </span>
      </div>

      {/* Mini Playlist */}
      <div className="space-y-1 max-h-16 overflow-y-auto">
        <div className="text-xs font-medium">Playlist</div>
        {playlist.slice(0, 3).map((track, index) => (
          <div
            key={index}
            className={`text-xs p-1 rounded cursor-pointer transition-colors ${
              track.title === currentTrack.title
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-surface-elevated'
            }`}
            onClick={() => setCurrentTrack({ ...track, duration: '3:42', currentTime: '0:00' })}
          >
            <div className="font-medium">{track.title}</div>
            <div className="text-muted-foreground">{track.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
};