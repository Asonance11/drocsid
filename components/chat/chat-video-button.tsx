"use Client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { Video, VideoOff } from "lucide-react";
import ActionTooltip from "../action-tooltip";

export const ChatVideoButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isVideo = searchParams?.get("video");

  const onClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true },
    );

    router.push(url);
  };
  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "start video clall";
  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text0zinc-500 dark:ext-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
