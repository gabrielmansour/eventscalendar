require 'open-uri'
class VenuesController < ApplicationController
  make_resourceful do
    actions :all
  end
  
  # TODO Use GetTypeAhead YPG method when it becomes available
  def search
    query = params[:q]
	  opts = {:pg => 1,	:pgLen => 10, :where => "Toronto", :what => query, :UID => 1, :apikey => "kdsu6xxqva28eu9zvpcpqfba" }
		result = open("http://api.sandbox.yellowapi.com/FindBusiness/?fmt=JSON&" + opts.map{|k,v| "#{CGI.escape(k.to_s)}=#{CGI.escape(v.to_s)}" }.join("&")).read
		response.content_type = Mime::JSON
    render :text => result
  end
end
