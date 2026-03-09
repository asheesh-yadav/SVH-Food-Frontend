"use client";
import React, { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { HeartIcon, Share2Icon, Copy, X } from "lucide-react";
import { MdRateReview } from "react-icons/md";
import "@/app/globals.css";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from "react-share";




import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
} from "react-share";

const reviews = [
  {
    name: "Shivam Yadav",
    rating: 5,
    message:
      "Absolutely amazing experience! The quality exceeded my expectations and the delivery was super fast. Highly recommend to everyone looking for premium products.",
    avatar: "/group.jpg",
  },
  {
    name: "Sajan Gautam",
    rating: 4,
    message:
      "Great product overall! Really satisfied with the purchase. The packaging was excellent and customer service was very responsive. Will definitely order again.",
    avatar: "/group.jpg",
  },
  {
    name: "Adesh Singh",
    rating: 5,
    message:
      "Outstanding quality and service! Everything arrived exactly as described. The attention to detail is impressive. This has become my go-to store for such products.",
    avatar: "/group.jpg",
  },
  {
    name: "Rishi",
    rating: 4,
    message:
      "Very pleased with my purchase! Good value for money and the product works perfectly. Shipping was quick and the item was well protected. Recommended!",
    avatar: "/group.jpg",
  },
  {
    name: "Ashish Maheshwari",
    rating: 5,
    message:
      "Exceptional experience from start to finish! The product quality is top-notch and exactly what I needed. Customer support was helpful throughout the process.",
    avatar: "/group.jpg",
  },
];

function ShareLikeRate({ type, url, id, title = id, image, price }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(false);
  };

  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    // On mount, check if this item is already liked
    const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
    const existingItem = likedItems.find((item) => item.id === id);
    if (existingItem) {
      setIsLike(true);
    }
  }, [id]);

  const handleLike = () => {
    const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
    const existingItem = likedItems.find((item) => item.id === id);

    if (existingItem) {
      // Remove item
      const updatedItems = likedItems.filter((item) => item.id !== id);
      localStorage.setItem("likedItems", JSON.stringify(updatedItems));
      setIsLike(false);
    } else {
      // Add item
      likedItems.push({ type, id, title, image, price });
      localStorage.setItem("likedItems", JSON.stringify(likedItems));
      setIsLike(true);
    }
  };

  return (
    <div className="w-full flex flex-col divyamRegular gap-4 justify-start items-start">
      {/* Share */}
      <div className="flex items-start justify-start ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Popover open={isCopied} onOpenChange={setIsCopied}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-200 cursor-pointer"
                  >
                    <Share2Icon size={20} className="" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <h3 className="text-sm font-semibold mb-2">
                    Share this package
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <FacebookShareButton url={url}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>

                    <TwitterShareButton url={url}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>

                    <WhatsappShareButton url={url}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>

                    <LinkedinShareButton url={url}>
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>

                    <EmailShareButton url={url}>
                      <EmailIcon size={32} round />
                    </EmailShareButton>

                    {/* Copy Link */}
                    <button
                      onClick={handleCopy}
                      className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>Share this package</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Favorite */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer hover:bg-red-200/50"
                onClick={handleLike}
              >
                {isLike ? (
                  <HeartIcon className="h-5 w-5 text-red-500 fill-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add to favorites</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Review */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsReviewOpen((prev) => !prev)}
                variant="ghost"
                size="icon"
                className={`rounded-full cursor-pointer ${
                  isReviewOpen ? "bg-blue-200/50" : ""
                } hover:bg-blue-200/50`}
              >
                {isReviewOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <MdRateReview className="h-5 w-5 text-blue-500 fill-blue-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Write a review</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {isReviewOpen && (
        <div className="flex mb-5 w-[100%] flex-col divyamRegular gap-4 justify-start items-start">
          <div class="flex gap-2 items-start w-full justify-start">
            <ul class="max-h-[400px] w-full overflow-y-auto rounded-lg shadow-inner bg-gray-50 px-2">
              <li class="font-semibold text-lg text-gray-800 mb-4 sticky top-0 bg-gray-50 py-2 z-[9] border-b border-gray-200">
                Customer Reviews
              </li>
              <div class="bg-white rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                {/* user info */}
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center mb-2">
                        <img
                          src={review.avatar}
                          alt={`${review.name} avatar`}
                          className="w-8 h-8 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {review.name}
                          </h4>
                          <div className="flex items-center">
                            {/* Star rating */}
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                              <svg
                                key={starIndex}
                                className={`w-4 h-4 ${
                                  starIndex < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed ml-11">
                        {review.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareLikeRate;
