import EventDetails from "@/views/admin/events/detail";

export default function Events({ params }: { params: { id: number } }) {
    return(<>
        <EventDetails params={params.id}/>
    </>)
}