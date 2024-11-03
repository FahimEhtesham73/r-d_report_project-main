import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Projects", "Reports", "Users"],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Projects
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: ["Projects"],
    }),
    createProject: builder.mutation({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...project }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),

    // Reports
    getReports: builder.query({
      query: (projectId) => `/reports/${projectId}`, // Use route parameter instead of query parameter
      providesTags: ["Reports"],
    }),
    getReport: builder.query({
      query: (id) => `/reports/${id}`,
      providesTags: ["Reports"],
    }),
    createReport: builder.mutation({
      query: (report) => ({
        url: "/reports",
        method: "POST",
        body: report,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateReport: builder.mutation({
      query: ({ id, ...report }) => ({
        url: `/reports/${id}`,
        method: "PUT",
        body: report,
      }),
      invalidatesTags: ["Reports"],
    }),

    // Users
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetReportsQuery,
  useGetReportQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useChangePasswordMutation
} = api;
