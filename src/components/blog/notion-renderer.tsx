"use client";

import { NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";
import { ExtendedRecordMap } from "notion-types";
import { defaultMapImageUrl } from "notion-utils";

// Dynamic imports for better performance
const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

interface NotionRendererWrapperProps {
  recordMap: ExtendedRecordMap;
}

export default function NotionRendererWrapper({ recordMap }: NotionRendererWrapperProps) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={false}
      components={{
        Code,
        Collection,
        Equation,
        Modal,
      }}
      mapPageUrl={(pageId) => `/posts/${pageId}`}
      mapImageUrl={(url, block) => defaultMapImageUrl(url, block)}
      showCollectionViewDropdown={false}
      showTableOfContents={false}
      minTableOfContentsItems={3}
      defaultPageIcon="📄"
      defaultPageCover=""
      defaultPageCoverPosition={0.5}
      className="notion-page"
    />
  );
}
