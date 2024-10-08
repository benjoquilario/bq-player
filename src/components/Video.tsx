import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/player';
import Hls, { HlsConfig } from 'hls.js';

type VideoProps = {
  children?: React.ReactNode;
  hlsConfig?: HlsConfig;
  className?: string;
  hlsVersion?: string;
  changeSourceUrl?: (currentSourceUrl: string, source: string) => string;
} & React.VideoHTMLAttributes<HTMLVideoElement>;

const Video = (props: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hls = useRef<Hls | null>(null);
  const { addVideoEventListeners, currentQuality } = usePlayerStore();

  useEffect(() => {
    if (!videoRef.current) return;

    addVideoEventListeners(videoRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function _initPlayer() {
      if (hls.current) {
        hls.current.destroy();
      }

      const _hls = new Hls({
        xhrSetup: (xhr, url) => {
          const requestUrl = props.changeSourceUrl?.(url, props.src!) || url;

          xhr.open('GET', requestUrl, true);
        },
        enableWorker: false,
        ...props.hlsConfig,
      });

      _hls.subtitleTrack = -1;
      _hls.subtitleDisplay = false;

      hls.current = _hls;

      if (videoRef.current != null) {
        _hls.attachMedia(videoRef.current);
      }

      _hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        _hls.loadSource(props.src!);

        _hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (props.autoPlay) {
            videoRef?.current
              ?.play()
              .catch(() =>
                console.log(
                  'Unable to autoplay prior to user interaction with the dom.'
                )
              );
          }

          if (!_hls.levels?.length) return;
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _hls.on(Hls.Events.ERROR, function (_, data: any) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              _hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              _hls.recoverMediaError();
              break;
            default:
              _initPlayer();
              break;
          }
        }
      });

      hls.current = _hls;
    }

    // Check for Media Source support
    if (Hls.isSupported()) {
      _initPlayer();
    }

    return () => {
      if (hls.current) {
        hls.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.src, props.hlsConfig]);

  if (Hls.isSupported())
    return (
      <video
        className="absolute inset-0 w-full h-full bg-black"
        playsInline
        crossOrigin="anonymous"
        ref={videoRef}
        {...props}
      />
    );

  return (
    <video
      ref={videoRef}
      autoPlay={props.autoPlay}
      preload="auto"
      // className={styles.video}
      playsInline
      crossOrigin="anonymous"
      {...props}
      className="absolute inset-0 w-full h-full bg-black"
    >
      {props.children}
    </video>
  );
};
export default Video;
