import { mutation, query } from "./_generated/server"
import { v } from "convex/values" // v: validator

// Create an interview
export const createInterview = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        endTime: v.optional(v.number()),
        status: v.string(),
        streamCallId: v.string(),
        candidateId: v.string(),
        interviewerIds: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User id not authenticated");

        const interview = await ctx.db.insert("interviews", {
            ...args,
        });

        return interview;
    }
})

// Get all comments for a specific interview
export const getAllInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User id not authenticated");

        const interviews = await ctx.db.query("interviews").collect();

        return interviews;
    },
});

// Get my interviews
export const getMyInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const interviews = await ctx.db
            .query("interviews")
            .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
            .collect();

        return interviews;
    }
});

// Get a specific interview by ID
export const getInterviewById = query({
    args: { streamCallId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("interviews")
            .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
            .first();
    }
});

// Update an interview status
export const updateInterviewStatus = mutation({
    args: {
        id: v.id("interviews"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, {
            status: args.status,
            ...(args.status === "completed" && { endTime: Date.now() })
        });
    }
});