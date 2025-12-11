const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Something went wrong',
        };
      }

      return { data };
    } catch (error: any) {
      return {
        error: error.message || 'Network error',
      };
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

// Auth APIs
export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  getProfile: () => api.get('/api/auth/profile'),
  
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
    api.put('/api/auth/profile', data),
};

// Course APIs
export const courseApi = {
  getAllCourses: (params?: { category?: string; level?: string; search?: string }) => {
    // Filter out empty values and 'all' before creating query string
    const filteredParams: Record<string, string> = {};
    if (params) {
      if (params.category && params.category !== 'all') filteredParams.category = params.category;
      if (params.level && params.level !== 'all') filteredParams.level = params.level;
      if (params.search && params.search.trim()) filteredParams.search = params.search.trim();
    }
    
    const query = new URLSearchParams(filteredParams).toString();
    console.log('API call with query:', query); // Debug log
    return api.get(`/api/courses${query ? `?${query}` : ''}`);
  },
  
  getCourseById: (id: string) => api.get(`/api/courses/${id}`),
  
  getMyCourses: () => api.get('/api/courses/my/enrolled'),
  
  getInstructorCourses: () => api.get('/api/courses/my/instructor'),
  
  createCourse: (data: any) => api.post('/api/courses', data),
  
  updateCourse: (id: string, data: any) => api.put(`/api/courses/${id}`, data),
  
  deleteCourse: (id: string) => api.delete(`/api/courses/${id}`),
  
  addLesson: (courseId: string, data: any) =>
    api.post(`/api/courses/${courseId}/lessons`, data),
  
  enrollCourse: (courseId: string) => api.post(`/api/courses/${courseId}/enroll`),
};

// Progress APIs
export const progressApi = {
  getProgress: (courseId: string) => api.get(`/api/progress/${courseId}`),
  
  updateProgress: (courseId: string, data: { lessonIndex: number; completed: boolean }) =>
    api.put(`/api/progress/${courseId}`, data),
  
  getAllProgress: () => api.get('/api/progress'),
};

// AI APIs
export const aiApi = {
  generateContent: (prompt: string, type: string) =>
    api.post('/api/ai/generate-content', { prompt, type }),
};
