class EventsController < ApplicationController
  make_resourceful do
    actions :all
    
    before :index do
      @month = (params[:month] || Time.zone.now.month).to_i
      @year = (params[:year] || Time.zone.now.year).to_i

      @shown_month = Date.civil(@year, @month)

      @event_strips = Event.event_strips_for_month(@shown_month)
    end
  end
end
