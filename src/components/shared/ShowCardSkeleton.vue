<template>
  <div
    class="relative box-border flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 text-left shadow-lg shadow-black/20 motion-reduce:animate-none">
    <div class="relative aspect-4/5 w-full overflow-hidden bg-slate-900 animate-pulse">
      <div
        class="size-full bg-linear-to-b from-slate-800/40 via-transparent to-slate-950/80" />
    </div>
    <div
      class="relative -mt-8 flex flex-1 flex-col rounded-t-3xl border-t border-sky-200/15 bg-linear-to-br from-slate-800/85 via-slate-900/95 to-slate-950 px-5 pt-5 pb-4 backdrop-blur-xl">
      <div class="mb-2 flex items-center gap-2">
        <div class="h-3 w-20 rounded-full bg-slate-700/60 animate-pulse" />
      </div>
      <div class="mb-3 min-h-14 flex flex-col gap-2">
        <div class="h-5 w-4/5 rounded-md bg-slate-700/70 animate-pulse" />
      </div>
      <div class="flex flex-wrap gap-1.5 pb-4">
        <div class="h-5 w-14 rounded-full bg-slate-800 animate-pulse" />
      </div>
    </div>
  </div>
</template>
