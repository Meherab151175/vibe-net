import { useToast } from "@/hooks/use-toast";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitPost } from "./actions";
import { PostsPage } from "@/lib/types";

export function useSubmitPostMutation(){
    const {toast} = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn:submitPost,
        onSuccess:async(newPost)=>{
            const queryFilter:QueryFilters = {queryKey:["post-feed","for-you"]}

            queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                queryFilter,
                (oldData)=>{
                    const firstPage = oldData?.pages[0];

                    if(fir)
                }
            )
        },
        onError(error){
            console.error(error),
            toast({
                variant:"destructive",
                description:"Failed to post. Please try again."
            })
        }
    });

    return mutation
}