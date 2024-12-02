'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { BetterTooltip } from '@/components/ui/tooltip';
import Link from 'next/link';
import { TrashIcon } from 'lucide-react';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap');

        .funnel-display {
          font-family: 'Funnel Display', serif;
          font-optical-sizing: auto;
          font-weight: 800; /* Adjust the weight as needed */
          font-style: normal;
          font-size: 1.5rem; /* Adjust the size as needed */
        }
      `}</style>
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="funnel-display px-2 hover:bg-muted rounded-md cursor-pointer">
                chatbot - liiist
              </span>
            </Link>
            <BetterTooltip content="clean chat" align="start">
              <Button
                variant="ghost"
                type="button"
                className="p-2 h-fit"
                onClick={() => {
                  setOpenMobile(false);
                  router.push('/');
                  router.refresh();
                }}
              >
                <TrashIcon />
              </Button>
            </BetterTooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="-mx-2">
          <SidebarHistory user={user} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-0 -mx-2">
        {user && (
          <SidebarGroup>
            <SidebarGroupContent>
              {/* Contact Us Button */}
              <div className="px py-2">
                <Link
                  href="mailto:ani.mema@proton.me"
                  className="block w-full text-center border border-white text-white bg-transparent rounded-md py-2 hover:bg-white hover:text-black transition-all"
                  onClick={() => setOpenMobile(false)}
                >
                  Contact Us
                </Link>
              </div>
              {/* User Account Info */}
              <SidebarUserNav user={user} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
