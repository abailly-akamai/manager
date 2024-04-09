import { HttpResponse, http } from 'msw';

import { mswDB } from '../db';
import { makeResourcePage } from '../serverHandlers';
import { convertToMswContent } from '../utils';

import type { PlacementGroup } from '@linode/api-v4';

const getPGMembers = (pg: any) => {
  return pg.members.map((m: any) => {
    return {
      is_compliant: true,
      linode_id: m.id,
    };
  });
};

export const placementGroups = [
  http.get('*placement/groups', () => {
    return HttpResponse.json(
      makeResourcePage(
        mswDB.placementGroup.getAll().map((pg) => {
          return {
            ...pg,
            members: getPGMembers(pg),
          };
        })
      )
    );
  }),
  http.get('*placement/groups/:id', ({ params }) => {
    const id = Number(params.id);
    const pg = mswDB.placementGroup.findFirst({
      where: {
        id: { equals: id },
      },
    });
    let updatedPg;
    if (pg) {
      updatedPg = {
        ...pg,
        members: getPGMembers(pg),
      };
    }
    return HttpResponse.json(updatedPg);
  }),
  http.post('*placement/groups', async ({ request }) => {
    const body = await request.json();
    const payload = {
      ...(body as any),
      is_compliant: true,
    };
    const newPg = mswDB.placementGroup.create(
      convertToMswContent<PlacementGroup>(payload)
    );
    return HttpResponse.json(newPg);
  }),
  http.put('*placement/groups/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = await request.json();

    const updatedPg = mswDB.placementGroup.update({
      data: body as any,
      where: {
        id: { equals: id },
      },
    });
    return HttpResponse.json(updatedPg);
  }),
  http.delete('*placement/groups/:id', ({ params }) => {
    const id = Number(params.id);
    mswDB.placementGroup.delete({
      where: {
        id: { equals: id },
      },
    });
    return HttpResponse.json({});
  }),
  http.post(
    '*/placement/groups/:placementGroupId/assign',
    async ({ params, request }) => {
      const body = (await request.json()) as any;
      const pgId = Number(params.placementGroupId);
      const pg = mswDB.placementGroup.update({
        data: {
          members: (_, _pg) => {
            return [
              ..._pg.members,
              mswDB.linode.findFirst({
                where: {
                  id: { equals: body.linodes[0] },
                },
              }),
            ] as any;
          },
        },
        where: {
          id: { equals: pgId },
        },
      });
      if (!pg) {
        return HttpResponse.json({}, { status: 404 });
      }
      return HttpResponse.json(pg);
    }
  ),
];
