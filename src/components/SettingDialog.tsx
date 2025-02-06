import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as React from "react"

interface SettingDialogProps {
  isOpen: boolean
  onClose: () => void
  playbackSpeed: number
  onPlaybackSpeedChange: (speed: number) => void
}

const SettingDialog = React.memo(
  ({
    isOpen,
    onClose,
    playbackSpeed,
    onPlaybackSpeedChange,
  }: SettingDialogProps) => {
    const handlePlaySpeedChange = (value: string) => {
      onPlaybackSpeedChange(Number.parseFloat(value))
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogDescription className="sr-only">
          Video settings
        </DialogDescription>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Video Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="playback-speed" className="text-right">
                Playback Speed
              </Label>
              <Select
                value={playbackSpeed.toString()}
                onValueChange={handlePlaySpeedChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select playback speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="0.75">0.75x</SelectItem>
                  <SelectItem value="1">Normal</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-quality" className="text-right">
                Video Quality
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select video quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="480p">480p</SelectItem>
                  <SelectItem value="360p">360p</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
)

export default SettingDialog
