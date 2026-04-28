import { baseApi } from './baseApi';

interface RolesResponse {
  roles: any[];
  allowedPermissions: string[];
}

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RolesResponse, void>({
      query: () => '/roles',
      providesTags: ['Role'],
    }),
    getRolesWithUsers: builder.query<any[], void>({
      query: () => '/roles/users',
      providesTags: ['Role', 'User'],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),
    createRole: builder.mutation<any, any>({
      query: (roleData) => ({
        url: '/roles',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: ['Role'],
    }),
    updateRole: builder.mutation<any, { id: string } & any>({
      query: ({ id, ...roleData }) => ({
        url: `/roles/${id}`,
        method: 'PUT',
        body: roleData,
      }),
      invalidatesTags: ['Role'],
    }),
  }),
});

export const { 
  useGetRolesQuery, 
  useGetRolesWithUsersQuery, 
  useDeleteRoleMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation
} = rolesApi;
