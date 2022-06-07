import {
  MediaCard,
  SkeletonBodyText,
  SkeletonDisplayText,
  Spinner,
} from "@shopify/polaris";

export const NASAImageSkeleton = () => {
  return (
    <MediaCard title="" description={""} portrait={true}>
      <div className="grid place-content-center mt-[25vh] mb-[25vh]">
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
