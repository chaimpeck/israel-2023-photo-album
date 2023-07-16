interface MediaEvent {
  baseDirectory: string;
  mediaGroups: Array<{
    media: string[];
    title: string;
  }>;
  title: string;
}