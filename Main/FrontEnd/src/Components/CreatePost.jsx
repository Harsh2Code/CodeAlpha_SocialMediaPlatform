import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import { Card } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

const CreatePost = () => {
  const { token } = useContext(AuthContext);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [postLink, setPostLink] = useState("");
  const [postVisibility, setPostVisibility] = useState("Public");

  const handlePostChange = (e) => {
    setPostContent(e.target.value);
  };
  const handleImageChange = (e) => {
    setPostImage(e.target.files[0]);
  };
  const handleLinkChange = (e) => {
    setPostLink(e.target.value);
  };

  const handleVisibilityChange = (visibility) => {
    setPostVisibility(visibility);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("content", postContent);
      formData.append("visibility", postVisibility);
      if (postImage) {
        formData.append("image", postImage);
      }
      if (postLink) {
        formData.append("link", postLink);
      }

      const response = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
        },
        body: formData,
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      const data = await response.json();
      console.log("Post created:", data);
      setPostContent("");
      setPostImage(null);
      setPostLink("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <Card className="p-4 max-w-5/6 mt-[4%] mx-auto" style={{ borderColor: "#6663f1" }}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex items-start space-x-4 p-[4%]" style={{
          borderRadius: '8px',
          boxShadow: 'rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -16px 15px 0px inset, rgba(0, 0, 0, 0.1) 0px -36px 20px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 16px 8px'
        }}>
          <div className="flex-1">
            <Label htmlFor="postContent" className="block mb-1 font-medium" style={{ color: "#6663f1" }}>
              About
            </Label>
            <Input
              as="textarea"
              id="postContent"
              value={postContent}
              onChange={handlePostChange}
              placeholder="What's on your mind?"
              className="resize-none h-24"
              required
              />
            <Label htmlFor="postImage" className="block mb-1 font-medium" style={{ color: "#6663f1" }}>
              Upload Image
            </Label>
            <input
              type="file"
              id="postImage"
              onChange={handleImageChange}
              className="h-[24px] w-[96%]"
            />
            <hr />
            <Label htmlFor="postLink" className="block mb-1 font-medium" style={{ color: "#6663f1" }}>
              Paste Link
            </Label>
            <Input
              as="textarea"
              id="postLink"
              value={postLink}
              onChange={handleLinkChange}
              placeholder="What's on your mind?"
              className="resize-none h-24"
            />
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Visibility: {postVisibility}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleVisibilityChange("Public")}>
                    Public
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleVisibilityChange("Friends")}>
                    Friends
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleVisibilityChange("Only Me")}>
                    Only Me
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button type="submit" disabled={!postContent.trim()}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default CreatePost;
