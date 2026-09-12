import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '@/components/app/AppHeader.vue'
import { useRoute } from 'vue-router'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    query: { q: '' },
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('AppHeader', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(AppHeader, {
      global: {
        stubs: {
          'router-link': true,
        },
      },
    })
  })

  it('renders the logo', () => {
    const logo = wrapper.find('[test-id="wachee-logo"]')
    const searchBar = wrapper.find('[test-id="search-bar"]')
    expect(logo.exists()).toBe(true)
    expect(searchBar.exists()).toBe(true)
  })

  it('header updates the scroll state on scroll', async () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as any).isScrolled).toBe(true)
  })

  it('header updates the search query when search input changes', async () => {
    const searchBar = wrapper.find('[test-id="search-bar"]')
    await searchBar.setValue('test')
    expect((wrapper.vm as any).searchQuery).toBe('test')
  })

  it('herder input get the url query', () => {
    vi.mocked(useRoute).mockReturnValueOnce({ query: { q: 'test' } } as any)
    wrapper = mount(AppHeader, {
      global: {
        stubs: {
          'router-link': true,
        },
      },
    })
    expect((wrapper.vm as any).searchQuery).toBe('test')
  })

  it('herder input get the first value if url query has multiple values', () => {
    vi.mocked(useRoute).mockReturnValueOnce({ query: { q: ['test1', 'test2'] } } as any)
    wrapper = mount(AppHeader, {
      global: {
        stubs: {
          'router-link': true,
        },
      },
    })
    expect((wrapper.vm as any).searchQuery).toBe('test1')
  })
})
