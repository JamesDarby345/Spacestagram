import {
  MediaCard,
  SkeletonBodyText,
  SkeletonDisplayText,
  Spinner,
} from "@shopify/polaris";

export const NASAImageSkeleton = () => {
  return (
    <MediaCard title="" description={""} portrait={true}>
      <div className="image_spinner">
        <Spinner accessibilityLabel="Image spinner" size="large" />
      </div>
      <div className="loading_skeleton_title">
        <SkeletonDisplayText size="small" />
      </div>
      <div className="loading_skeleton_text">
        <SkeletonBodyText lines={4} />
      </div>
    </MediaCard>
  );
};
