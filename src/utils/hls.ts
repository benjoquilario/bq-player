export type Source = {
  file: string;
  label?: string;
  type?: string | 'hls' | 'dash';
};

export const shouldPlayHls = (source: Source) =>
  source.file.includes('m3u8') || source.type === 'hls';

export const getHlsScriptUrl = (version = 'latest') => {
  return `https://cdn.jsdelivr.net/npm/hls.js@${version}/dist/hls.min.js`;
};

export const getAltHlsScriptUrl = (version = '1.4.10') => {
  return `https://cdnjs.cloudflare.com/ajax/libs/hls.js/${version}/hls.min.js`;
};
