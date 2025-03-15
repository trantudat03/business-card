import React, { useRef, useCallback, useEffect } from "react";

type InfiniteScrollProps = {
  load: () => void;
  hasMore: boolean;
  loader: React.ReactNode;
  children?: React.ReactNode;
  endMessage?: React.ReactNode;
};

const InfiniteScroll = ({
  load,
  hasMore,
  loader,
  children,
  endMessage,
}: InfiniteScrollProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // Check if the sentinel element is intersecting, and if so, call the load function
      if (entries[0].isIntersecting && hasMore) {
        load();
      }
    },
    [hasMore, load]
  );

  useEffect(() => {
    // Create a new IntersectionObserver when the component mounts
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    // Attach the observer to the sentinel element
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    // Clean up the observer when the component unmounts
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect, load]);

  useEffect(() => {
    // When the hasMore prop changes, disconnect the previous observer and reattach it to the new sentinel element
    if (observerRef.current && sentinelRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(sentinelRef.current);
    }
  }, [hasMore]);

  return (
    <div>
      {children}
      <div ref={sentinelRef}>{hasMore && loader}</div>
      {!hasMore && endMessage}
    </div>
  );
};

export default InfiniteScroll;
