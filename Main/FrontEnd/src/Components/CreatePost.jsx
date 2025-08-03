import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import API_BASE_URL from "../lib/apiConfig.js";

import { Card } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

const CreatePost = () => {
  const { token } = useContext(AuthContext);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postLink, setPostLink] = useState("");
  const [postVisibility, setPostVisibility] = useState("Public");

  const handleTitleChange = (e) => {
    setPostTitle(e.target.value);
  };

  const handlePostChange = (e) => {
    setPostContent(e.target.value);
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
      formData.append("title", postTitle);
      formData.append("title", postTitle);
      formData.append("content", postContent);
      formData.append("visibility", postVisibility);
      if (postLink) {
        formData.append("image", postLink);
      }

      const response = await fetch(`${API_BASE_URL}/api/posts/`, {
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
      setPostTitle("");
      setPostContent("");
      
      setPostLink("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <Card className="p-4 max-w-5/6 mt-[8%] mx-auto" style={{ borderColor: "#CDB384", backgroundColor: '#200054', borderRadius: "1rem" }}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4" style={{boxShadow: 'rgba(0, 0, 0, 0.17) 0px -24px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -16px 15px 0px inset, rgba(0, 0, 0, 0.1) 0px -36px 20px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 16px 8px', borderRadius: "1rem"}}>
        <h1 className="mx-auto" style={{marginTop: "-60px"}}> Create a Post </h1>
        <div className="flex items-start space-x-4 p-[4%]" style={{
         
        }}>
          <div className="flex-1">
            <Label htmlFor="postContent" className="block mb-1 font-medium" style={{ color: "#CDB384" }}>
              Title
            </Label>
            <Input
              as="textarea"
              id="postTitle"
              value={postTitle}
              onChange={handleTitleChange}
              placeholder="what should be the title, Hmmm!..."
              className="resize-none h-24"
              required
              />
            <Label htmlFor="postContent" className="block mb-1 font-medium" style={{ color: "#CDB384" }}>
              About
            </Label>
            <Input
              as="textarea"
              id="postContent"
              value={postContent}
              onChange={handlePostChange}
              placeholder="There should be something that sets the story! Right?.."
              className="resize-none h-[30px]"
              style={{height: "5rem"}}
              required
              />
            
            <Label htmlFor="postLink" className="block mb-1 font-medium" style={{ color: "#CDB384" }}>
              Paste Link
            </Label>
            <Input
              as="textarea"
              id="postLink"
              value={postLink}
              onChange={handleLinkChange}
              placeholder="Hello!, if you have the link then I eat Link! please let me have it!"
              className="resize-none h-24"
            />
            <div className="flex items-center justify-between mt-[1rem]">
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